import React, { Component, PropTypes } from 'react'

import debounce from 'lodash/debounce'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import cx from 'classnames'

import { addTab, removeTab } from 'actions/editor'
import { openModal, closeModal } from 'actions/modals'

import { isModalOpen } from 'reducers/modals'

import { Tabs, Tab } from 'components/Tabs'
import Button from 'components/Button'
import DragResize from 'components/DragResize'
import Empty from 'components/Empty'
import Footer from 'components/Footer'
import GistPanel from 'components/GistPanel'
import GistsActions from 'components/GistsActions'
import Iframe from 'components/Iframe'
import Input from 'components/Input'
import Modal from 'components/Modal'

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

@connect(state => ({
  activeTab: state.editor.get('activeTab'),
  editorSize: state.editor.get('editorSize'),
  gist: state.gist,
  tabs: state.editor.get('tabs'),
  isModalNewFileOpen: isModalOpen(state, 'NEW_FILE'),
}),
dispatch => ({

  addGistFile: file => dispatch({ type: 'ADD_GIST_FILE', payload: file }),

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

    openModal,
    closeModal,

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
    filenameValue: '',
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
      isModalNewFileOpen,
      tabs,
    } = this.props

    const willHideEditor = this.props.activeTab && !nextProps.activeTab

    if (willHideEditor) {
      this.setState({
        showEditor: false,
      })
    }

    if (showEditor && !willHideEditor && activeTab !== nextProps.activeTab) {
      this.saveHistory()
    }

    if (tabs.size === 0 && nextProps.tabs.size > 0) {
      this.setState({
        showEditor: true,
      })
    }

    if (isModalNewFileOpen && !nextProps.isModalNewFileOpen) {
      this.setState({
        filenameValue: '',
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
      isModalNewFileOpen,
    } = this.props

    const {
      showEditor,
    } = this.state

    if (showEditor && activeTab !== prevProps.activeTab) {
      this.changeTab()
    }

    if (isModalNewFileOpen && this.input) {
      this.input.focus()
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

  handleFileAdd = () => {
    const {
      openModal,
    } = this.props

    openModal('NEW_FILE')
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

  handleChangeInputFilename = value => this.setState({
    filenameValue: value,
  })

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

  toggleModalNewFile = () => {
    const {
      isModalNewFileOpen,
      closeModal,
      openModal,
    } = this.props

    if (isModalNewFileOpen) {
      closeModal('NEW_FILE')
    } else {
      openModal('NEW_FILE')
    }
  }

  addFile = e => {
    const {
      addGistFile,
      closeModal,
    } = this.props

    const {
      filenameValue,
    } = this.state

    if (e) { e.preventDefault() }

    const filename = `${filenameValue}.mjml`

    addGistFile({
      [filename]: {
        content: '',
        filename,
      }
    })

    closeModal('NEW_FILE')
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
      isModalNewFileOpen,
    } = this.props

    const {
      cursor,
      filenameValue,
      onResize,
      showEditor,
      showPreview,
    } = this.state

    const hasFiles = gist.get('files').size > 0

    return (
      <div
        className={cx('Editor', {
          'Editor--preview': showPreview,
          'Editor--onResize': showPreview && onResize,
        })}
      >
        <Modal
          onClose={this.toggleModalNewFile}
          isOpened={isModalNewFileOpen}
        >
          <form
            className="horizontal-list"
            onSubmit={this.addFile}
          >
            <Input
              className="flex-1"
              onChange={this.handleChangeInputFilename}
              placeholder="Filename"
              ref={r => this.input = r}
              value={filenameValue}
            />
            <div className="marginLeft-0">
              .mjml
            </div>
            <div>
              <Button
                onClick={this.addFile}
                // isLoading={isLoadingGist}
              >
                Create
              </Button>
            </div>
          </form>
        </Modal>

        <GistsActions />

        <Tabs>

          <Tab
            float={true}
            onClick={this.handleFileAdd}
            remove={false}
          >
            <IconAdd />
          </Tab>

          {tabs.map(this.renderTab)}

        </Tabs>

        <div className="Editor-Wrapper">

          {/* -- GIST PANEL -- */}

          { hasFiles &&
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
