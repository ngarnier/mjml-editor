import React, {
  Component,
} from 'react'

import Empty from 'components/Empty'
import Footer from 'components/Footer'

import IconHtml from 'icons/Html'

import './styles.scss'

class Preview extends Component {

  componentWillReceiveProps (nextProps) {
    const {
      preview,
    } = nextProps

    if (preview && this.iframe) {
      const doc = this.iframe.contentDocument
      const documentElement = doc.documentElement

      documentElement.innerHTML = preview.html
    }
  }

  render () {
    const {
      preview,
    } = this.props

    return (
      <div className="Preview">
        <div className="Preview-Iframe">
          <iframe
            ref={r => this.iframe = r}
            style={{
              display: preview
                ? 'block'
                : 'none',
            }}
          />
          { !preview &&
            <Empty>
              <IconHtml />
              ಠ_ಠ
            </Empty> }
        </div>
        { preview &&
          <Footer
            align="right"
            items={[
              `Html size: ${preview.size}`,
              `Time for render: ${preview.executionTime}ms`,
              `Last render: ${new Date(preview.lastRender)}`,
            ]}
          /> }
      </div>
    )
  }

}

export default Preview
