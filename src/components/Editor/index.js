import React, {
  Component,
} from 'react'

import find from 'lodash/find'
import map from 'lodash/map'
import debounce from 'lodash/debounce'

import cx from 'classnames'
import shortid from 'shortid'

import Immutable, {
  fromJS,
  Map,
} from 'immutable'

import {
  connect,
} from 'react-redux'

import {
  Tabs,
  Tab,
} from 'components/Tabs'

import socket from 'getClientSocket'

import Empty from 'components/Empty'
import Footer from 'components/Footer'
import Iframe from 'components/Iframe'
import TabActions from 'components/TabActions'

import IconAdd from 'icons/Add'
import IconProgramming from 'icons/Programming'

let CodeMirror

if (__BROWSER__) {
  CodeMirror = require('codemirror')

  require('codemirror/addon/selection/active-line')
  require('codemirror/addon/edit/closetag')

  require('codemirror/mode/xml/xml')
  require('codemirror/mode/javascript/javascript')
}

import './styles.scss'

@connect(
  ({ editor }) => ({
    editor,
  })
)
class Editor extends Component {

  _codeMirror = null

  _history = {}

  static defaultProps = {
    editor: {
      activeTab: null,
      tabs: [],
    }
  }

  constructor (props) {
    super()

    const tabs = map(props.editor.tabs, item => ({
      ...item,
      id: item.id || shortid.generate(),
    }))

    this.state = {
      activeTab: props.editor.activeTab !== null
        ? props.editor.activeTab
        : tabs.length > 0
          ? tabs[0].id
          : null,
      tabs: fromJS(tabs),
      cursor: null,
      showEditor: tabs.length > 0
        ? true
        : false,
      showPreview: true,
    }
  }

  componentDidMount () {
    const {
      showEditor,
    } = this.state

    socket.on('send-html-to-preview', () => {
      this.renderHTML(this.getCurrentValue())
    })

    socket.on('minimize-preview', () => {
      this.setState({
        showPreview: true,
      })
    })

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
      tabs,
    } = this.state

    if (showEditor &&
        activeTab !== prevState.activeTab) {
      this.changeTab()
    }

    if (activeTab !== prevState.activeTab) {
      socket.emit('editor-set-active-tab', {
        activeTab,
      })
    }

    this.saveDebounceTabs(tabs)
  }

  handleCursorChange = insance => this.setState({
    cursor: insance.getCursor(),
  })

  handleChange = instance => {
    const value = instance.getValue()

    this.renderDebounceHTML(value)
    this.saveDebounceMJML(value)
  }

  handleTabChange = id => this.setState({
    activeTab: id,
  })

  handleTabAdd = () => {
    const id = shortid.generate()

    this.setState(prev => ({
      activeTab: id,
      tabs: prev.tabs.insert(
        prev.tabs.findIndex(item => item.get('id') === prev.activeTab) + 1,
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
      tabs,
    } = this.state

    const index = tabs.findIndex(item => item.get('id') === id)
    const newTabs = tabs.delete(index)

    let newActiveTab = activeTab

    if (activeTab === id) {
      if (newTabs.size > 0) {
        newActiveTab = index - 1 < 0
          ? newTabs.get(0).get('id')
          : newTabs.get(index - 1).get('id')
      } else {
        newActiveTab = null
      }
    }

    delete this._history[id]

    this.setState({
      activeTab: newActiveTab,
      tabs: newTabs,
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
      tabs,
    } = this.state

    if (activeTab === null) {
      return ''
    }

    const currentTab = tabs.find(item => item.get('id') === activeTab)

    if (currentTab) {
      return currentTab.get('value')
    }

    return ''
  }

  saveDebounceMJML = debounce(mjml => {
    const {
      activeTab,
      tabs,
    } = this.state

    const index =

    this.setState({
      tabs: tabs.setIn([
        tabs.findIndex(item => item.get('id') === activeTab),
        'value',
      ], mjml)
    })
  }, 25)

  saveDebounceTabs = debounce(tabs => {
    socket.emit('editor-set-tabs', {
      tabs: tabs.toJS(),
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

  changeTab () {
    this._codeMirror.setValue(this.getCurrentValue())

    this.setHistory()

    this._codeMirror.focus()
  }

  renderEditor () {
    const value = this.getCurrentValue()

    this._codeMirror = CodeMirror.fromTextArea(this.textarea, {
      mode: 'xml',
      lineNumbers: true,
      theme: 'one-dark',
      autoCloseTags: true,
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
    socket.emit('mjml-to-html', {
      mjml,
    })
  }

  render () {
    const {
      activeTab,
      tabs,
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
          { tabs.map(item => (
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

        {tabs.size > 0 && <TabActions />}

        <div className="Editor-Wrapper">
          <div className="Editor-Left">
            <div className="Editor-CodeMirror">
              <textarea
                defaultValue={this.getCurrentValue()}
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
