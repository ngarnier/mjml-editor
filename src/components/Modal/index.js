import React, { Component, PropTypes } from 'react'
import Mortal from 'react-mortal'

import './styles.scss'

class Modal extends Component {

  static propTypes = {
    isOpened: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  render () {

    const {
      isOpened,
      onClose,
      children,
    } = this.props

    return (
      <Mortal
        isOpened={isOpened}
        onClose={onClose}
        motionStyle={(spring, isVisible) => ({
          opacity: spring(isVisible ? 1 : 0),
          modalOffset: spring(isVisible ? 0 : -100, {
            stiffness: isVisible ? 170 : 250,
          }),
        })}
      >
        {(motion, isVisible) => (
          <div
            className="Modal"
            style={{
              pointerEvents: isVisible ? 'auto' : 'none',
            }}
          >
            <div
              className="Modal--overlay"
              onClick={onClose}
              style={{
                opacity: motion.opacity,
                pointerEvents: isVisible ? 'auto' : 'none',
              }}
            />
            <div
              className="Modal--body"
              style={{
                transform: `translate3d(0, ${motion.modalOffset}%, 0)`,
              }}
            >
              {children}
            </div>
          </div>
        )}
      </Mortal>
    )
  }

}

export default Modal
