import React, { Component, PropTypes } from 'react'

import debounce from 'lodash/debounce'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import cx from 'classnames'

import { addTab, removeTab } from 'actions/editor'

import { Tabs, Tab } from 'components/Tabs'
import DragResize from 'components/DragResize'
import Empty from 'components/Empty'
import Footer from 'components/Footer'
import GistPanel from 'components/GistPanel'
import Iframe from 'components/Iframe'
import TabActions from 'components/TabActions'

import IconAdd from 'icons/Add'
import IconProgramming from 'icons/Programming'

let CodeMirror

if (__BROWSER__) {
  CodeMirror = require('codemirror')

  require('codemirror/addon/selection/active-line')
  require('codemirror/addon/edit/closetag')
  require('codemirror/addon/search/match-highlighter')

  require('codemirror/mode/xml/xml')
}

import './styles.scss'

@connect(({ gist, editor }) => ({
  activeTab: editor.get('activeTab'),
  editorSize: editor.get('editorSize'),
  gist,
  tabs: editor.get('tabs'),
}),
dispatch => ({

  // set this id as current active tab
  setActiveTab: id => dispatch({ type: 'SET_ACTIVE_TAB', payload: id }),

  // assigning mjml value to current tab
  setCurrentValue: mjml => dispatch({ type: 'SET_CURRENT_VALUE', payload: mjml }),

  // bind raw actions with dispatch
  ...bindActionCreators({

    // add a tab
    addTab,

    // remove a tab
    removeTab,

    }, dispatch),

}))
class Editor extends Component {

  static contextTypes = {
    socket: PropTypes.object,
  }

  _codeMirror = null // eslint-disable-line react/sort-comp

  _history = {}

  state = {
    cursor: null,
    onResize: false,
    showEditor: this.props.tabs.size > 0,
    showPreview: true,
  }

  componentDidMount () {
    const {
      socket,
    } = this.context

    const {
      showEditor,
    } = this.state

    socket.on('PING_EDITOR', () => {
      console.log('PING_EDITOR')
      setTimeout(() => socket.emit('event', 'PONG_EDITOR'), 1e3)
    })

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
      tabs,
    } = this.props

    const willHideEditor = this.props.activeTab && !nextProps.activeTab

    if (willHideEditor) {
      this.setState({ showEditor: false })
    }

    if (showEditor && !willHideEditor && activeTab !== nextProps.activeTab) {
      this.saveHistory()
    }

    if (tabs.size === 0 && nextProps.tabs.size > 0) {
      this.setState({
        showEditor: true,
      })
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
    } = this.props

    const {
      showEditor,
    } = this.state

    if (showEditor && activeTab !== prevProps.activeTab) {
      this.changeTab()
    }
  }

  componentWillUnmount () {
    const {
      socket,
    } = this.context

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

    window.open(`/preview/${window.__SOCKET_ROOM__}`, '_blank', 'toolbar=0,menubar=0')
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
      highlightSelectionMatches: {
        wordsOnly: true,
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
    this.context.socket.emit('mjml-to-html', {
      mjml,
    })
  }

  renderTab = item => (
    <Tab
      active={item.get('id') === this.props.activeTab}
      key={item.get('id')}
      onClick={this.handleTabChange.bind(this, item.get('id'))}
      onRemove={this.handleTabRemove.bind(this, item.get('id'))}
    >
      {item.get('name')}
    </Tab>
  )

  render () {

    const {
      editorSize,
      gist,
      tabs,
    } = this.props

    const {
      cursor,
      onResize,
      showEditor,
      showPreview,
    } = this.state

    return (
      <div
        className={cx('Editor', {
          'Editor--preview': showPreview,
          'Editor--onResize': showPreview && onResize,
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

          {tabs.map(this.renderTab)}

        </Tabs>

        {tabs.size > 0 && <TabActions />}

        <div className="Editor-Wrapper">

          {/* -- GIST PANEL -- */}

          { gist.get('id') &&
            <GistPanel /> }

          {/* -- LEFT PANEL -- */}

          <div
            className="Editor-Left"
            style={{
              flexBasis: `${showPreview ? editorSize : 100}%`,
            }}
          >

            <div className="Editor-CodeMirror">
              <div className="sticky">

                <textarea
                  defaultValue={this.getCurrentValue()}
                  ref={r => this.textarea = r}
                />

                {!showEditor && (
                  <Empty>
                    <IconProgramming />
                    {'¯\\_(ツ)_/¯'}
                  </Empty>
                )}

              </div>
            </div>

            {/* -- LEFT PANEL FOOTER -- */}

            {showEditor && cursor !== null && (
              <Footer
                items={[
                  `${cursor.line + 1}:${cursor.ch + 1}`,
                ]}
              />
            )}

          </div>

          {showPreview && (
            <DragResize
              onDragStart={() => this.setState({ onResize: true })}
              onDragEnd={() => this.setState({ onResize: false })}
            />
          )}

          {/* -- RIGHT PANEL -- */}

          {showPreview && (
            <div
              className="Editor-Right"
              style={{
                flexBasis: `${100 - editorSize}%`,
              }}
            >
              <Iframe
                onMaximize={this.handleMaximize}
                maximize={true}
              />
            </div>
          )}

        </div>
      </div>
    )
  }

}

export default Editor
