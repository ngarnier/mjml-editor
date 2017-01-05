import React, {
  Component,
} from 'react'

import find from 'lodash/find'
import map from 'lodash/map'
import debounce from 'lodash/debounce'

import io from 'socket.io-client'
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
import Iframe from 'components/Iframe'

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
      showEditor: content.length > 0
        ? true
        : false,
      showPreview: true,
    }
  }

  componentDidMount () {
    const {
      showEditor,
    } = this.state

    if (showEditor) {
      this.renderEditor()
    }

    this.socket = io.connect()

    this.socket.on('send-html-to-preview', () => {
      this.renderHTML(this.getCurrentValue())
    })

    this.socket.on('minimize-preview', () => {
      this.setState({
        showPreview: true,
      })
    })
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

    this.renderDebounceHTML(value)
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

  handleMaximize = () => {
    this.setState({
      showPreview: false,
    })

    window.open('/preview', '_blank', 'toolbar=0,menubar=0')
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

    this.renderHTML('')
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

  renderDebounceHTML = debounce(mjml => {
    this.renderHTML(mjml)
  }, 250)

  renderHTML = mjml => {
    this.socket.emit('mjml-to-html', {
      mjml,
    })
  }

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
      showPreview,
    } = this.state

    return (
      <div className={cx('Editor', {
        'Editor--preview': showPreview,
      })}>
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
          { showPreview &&
            <div className="Editor-Right">
              <Iframe
                onMaximize={this.handleMaximize}
                maximize={true}
              />
            </div> }
        </div>
      </div>
    )
  }

}

export default Editor
