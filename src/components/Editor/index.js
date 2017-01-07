import React, {
  Component,
} from 'react'

import debounce from 'lodash/debounce'

import cx from 'classnames'

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
    activeTab: editor.get('activeTab'),
    tabs: editor.get('tabs'),
  }),
  dispatch => ({

    // add a tab
    addTab: () => dispatch({ type: 'ADD_TAB' }),

    // remove a tab
    removeTab: id => dispatch({ type: 'REMOVE_TAB', payload: id }),

    // set this id as current active tab
    setActiveTab: id => dispatch({ type: 'SET_ACTIVE_TAB', payload: id }),

    // assigning mjml value to current tab
    setCurrentValue: mjml => dispatch({ type: 'SET_CURRENT_VALUE', payload: mjml }),

  })
)
class Editor extends Component {

  _codeMirror = null // eslint-disable-line react/sort-comp

  _history = {}

  state = {
    cursor: null,
    showEditor: this.props.tabs.size > 0,
    showPreview: true,
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

  componentWillReceiveProps (nextProps) {

    const {
      showEditor,
    } = this.state

    const {
      activeTab,
    } = this.props

    const willHideEditor = this.props.activeTab && !nextProps.activeTab

    if (willHideEditor) {
      this.setState({ showEditor: false })
    }

    if (showEditor && !willHideEditor && activeTab !== nextProps.activeTab) {
      this.saveHistory()
    }

  }

  componentWillUpdate (nextProps, nextState) {

    const {
      showEditor,
    } = this.state

    if (showEditor && !nextState.showEditor) {
      this.destroyEditor()
    }

    if (!showEditor && nextState.showEditor) {
      this.renderEditor()
    }
  }

  componentDidUpdate (prevProps) {
    const {
      activeTab,
      tabs,
    } = this.props

    const {
      showEditor,
    } = this.state

    if (activeTab !== prevProps.activeTab) {
      socket.emit('editor-set-active-tab', { activeTab })
      if (showEditor) {
        this.changeTab()
      }
    }

    this.saveDebounceTabs(tabs)
  }

  componentWillUnmount () {
    socket.removeAllListeners('send-html-to-preview')
    socket.removeAllListeners('minimize-preview')
  }

  handleCursorChange = insance => this.setState({
    cursor: insance.getCursor(),
  })

  handleChange = instance => {
    const value = instance.getValue()

    this.renderDebounceHTML(value)
    this.saveDebounceMJML(value)
  }

  handleTabChange = id => this.props.setActiveTab(id)

  handleTabAdd = () => {
    this.props.addTab()
    this.setState({
      showEditor: true,
    })
  }

  handleTabRemove = (id, e) => {
    e.stopPropagation()
    this.props.removeTab(id)
    delete this._history[id]
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
    } = this.props

    this._history[activeTab] = this._codeMirror.getHistory()
  }

  setHistory () {
    const {
      activeTab,
    } = this.props

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
    } = this.props

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
    this.props.setCurrentValue(mjml)
  }, 25)

  saveDebounceTabs = debounce(tabs => {
    socket.emit('editor-set-tabs', { tabs: tabs.toJS() })
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
    } = this.props

    const {
      cursor,
      showEditor,
      showPreview,
    } = this.state

    return (
      <div
        className={cx('Editor', {
          'Editor--preview': showPreview,
        })}
      >
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
