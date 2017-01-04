import React, {
  Component,
} from 'react'

import find from 'lodash/find'
import map from 'lodash/map'
import debounce from 'lodash/debounce'

import axios from 'axios'
import cx from 'classnames'
import shortid from 'shortid'
import {
  fromJS,
  Map,
} from 'immutable'

import {
  Tabs,
  Tab,
} from 'components/Tabs'
import Empty from 'components/Empty'
import Footer from 'components/Footer'
import Preview from 'components/Preview'

import IconAdd from 'icons/Add'
import IconProgramming from 'icons/Programming'

let CodeMirror

if (__BROWSER__) {
  CodeMirror = require('codemirror')

  require('codemirror/addon/selection/active-line')

  require('codemirror/mode/xml/xml')
  require('codemirror/mode/javascript/javascript')
}

import './styles.scss'

class Editor extends Component {

  _codeMirror = null

  _history = {}
  _request = null

  static defaultProps = {
    content: [],
  }

  constructor (props) {
    super()

    const content = map(props.content, item => ({
      ...item,
      id: shortid.generate(),
    }))

    this.state = {
      activeTab: props.activeTab || content.length > 0
        ? content[0].id
        : null,
      content: fromJS(content),
      cursor: null,
      preview: {},
      showEditor: content.length > 0
        ? true
        : false,
    }
  }

  componentDidMount () {
    const {
      showEditor,
    } = this.state

    if (showEditor) {
      this.renderEditor()
    }
  }

  componentWillUpdate (nextProps, nextState) {
    const {
      activeTab,
      showEditor,
    } = this.state

    if (showEditor &&
        activeTab !== nextState.activeTab) {
      this.saveHistory()
    }

    if (showEditor === true &&
        nextState.showEditor === false) {
      this.destroyEditor()
    }

    if (showEditor === false &&
        nextState.showEditor === true) {
      this.renderEditor()
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const {
      activeTab,
      showEditor,
    } = this.state

    if (showEditor &&
        activeTab !== prevState.activeTab) {
      this.changeTab()
    }
  }

  handleCursorChange = insance => this.setState({
    cursor: insance.getCursor(),
  })

  handleChange = instance => {
    const value = instance.getValue()

    if (/^\s*</.test(value)) {
      instance.setOption('mode', 'xml')
    }

    if (!/^\s*</.test(value) && value.match(/\S/)) {
      instance.setOption('mode', 'application/json')
    }

    this.renderHTML(value)
    this.saveMJML(value)
  }

  handleTabChange = id => this.setState({
    activeTab: id,
  })

  handleTabAdd = () => {
    const id = shortid.generate()

    this.setState(prev => ({
      activeTab: id,
      content: prev.content.insert(
        prev.content.findIndex(item => item.get('id') === prev.activeTab) + 1,
        Map({
          id,
          name: 'untitled',
          value: '',
        })
      ),
      showEditor: true,
    }))
  }

  handleTabRemove = (id, e) => {
    e.stopPropagation()

    const {
      activeTab,
      content,
    } = this.state

    const index = content.findIndex(item => item.get('id') === id)
    const newContent = content.delete(index)

    let newActiveTab = activeTab

    if (activeTab === id) {
      if (newContent.size > 0) {
        newActiveTab = index - 1 < 0
          ? newContent.get(0).get('id')
          : newContent.get(index - 1).get('id')
      } else {
        newActiveTab = null
      }
    }

    delete this._history[id]

    this.setState({
      activeTab: newActiveTab,
      content: newContent,
      showEditor: newActiveTab === null
        ? false
        : true,
    })
  }

  saveHistory () {
    const {
      activeTab,
    } = this.state

    this._history[activeTab] = this._codeMirror.getHistory()
  }

  setHistory () {
    const {
      activeTab,
    } = this.state

    const history = this._history[activeTab]

    if (history) {
      this._codeMirror.setHistory(history)
    } else {
      this._codeMirror.clearHistory()
    }
  }

  getCurentPreview () {
    const {
      activeTab,
      preview,
    } = this.state

    if (activeTab === null) {
      return null
    }

    return preview[activeTab]
  }

  getCurrentValue () {
    const {
      activeTab,
      content,
    } = this.state

    if (activeTab === null) {
      return ''
    }

    return content.find(item => item.get('id') === activeTab).get('value')
  }

  saveMJML = debounce(mjml => {
    const {
      activeTab,
      content,
    } = this.state

    const index =

    this.setState({
      content: content.setIn([
        content.findIndex(item => item.get('id') === activeTab),
        'value',
      ], mjml)
    })
  }, 250)

  destroyEditor () {
    if (this._codeMirror) {
      this._codeMirror.toTextArea()

      this._codeMirror = null

      this._history = {}
    }
  }

  renderEditor () {
    const value = this.getCurrentValue()

    this._codeMirror = CodeMirror.fromTextArea(this.textarea, {
      mode: 'xml',
      lineNumbers: true,
      theme: 'one-dark',
      value,
      styleActiveLine: {
        nonEmpty: true,
      },
    })

    this._codeMirror.on('change', this.handleChange)
    this._codeMirror.on('focus', this.handleCursorChange)
    this._codeMirror.on('cursorActivity', this.handleCursorChange)

    this._codeMirror.focus()

    this.renderHTML(value)
  }

  renderHTML = debounce(mjml => {
    if (mjml === '') {
      return
    }

    const {
      activeTab,
      preview,
    } = this.state

    if (this._request !== null) {
      this._request.cancel()
    }

    const {
      CancelToken,
    } = axios

    this._request = CancelToken.source()

    axios.post('/api/mjml2html', {
      mjml,
    }, {
      cancelToken: this._request.token,
    })
    .then(res => {
      const {
        data,
      } = res

      preview[activeTab] = data

      this.setState(prev => ({
        preview,
      }))
    })
  }, 250)

  changeTab () {
    this._codeMirror.setValue(this.getCurrentValue())

    this.setHistory()

    this._codeMirror.focus()
  }

  render () {
    const {
      activeTab,
      content,
      cursor,
      showEditor,
    } = this.state

    return (
      <div className="Editor">
        <Tabs>
          <Tab
            float={true}
            onClick={this.handleTabAdd}
            remove={false}
          >
            <IconAdd />
          </Tab>
          { content.map(item => (
            <Tab
              active={item.get('id') === activeTab}
              key={item.get('id')}
              onClick={this.handleTabChange.bind(this, item.get('id'))}
              onRemove={this.handleTabRemove.bind(this, item.get('id'))}
            >
              {item.get('name')}
            </Tab>
          )) }
        </Tabs>
        <div className="Editor-Wrapper">
          <div className="Editor-Left">
            <div className="Editor-CodeMirror">
              <textarea
                ref={r => this.textarea = r}
              />
              { !showEditor &&
                <Empty>
                  <IconProgramming />
                  ¯\_(ツ)_/¯
                </Empty> }
            </div>
            { showEditor &&
              cursor !== null &&
              <Footer
                items={[
                  `${cursor.line + 1}:${cursor.ch + 1}`,
                ]}
              /> }
          </div>
          <div className="Editor-Right">
            <Preview
              preview={this.getCurentPreview()}
            />
          </div>
        </div>
      </div>
    )
  }

}

export default Editor
