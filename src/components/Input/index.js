import React, {
  Component,
} from 'react'

import './styles.scss'

class Input extends Component {

  static defaultProps = {
    type: 'text',
  }

  focus = () => this.input.focus()

  handleChange = e => this.props.onChange(e.target.value)

  render () {
    const {
      defaultValue,
      placeholder,
      type,
      value,
    } = this.props

    return (
      <div className="Input">
        <input
          defaultValue={defaultValue}
          onChange={this.handleChange}
          placeholder={placeholder}
          ref={r => this.input = r}
          type={type}
          value={value}
        />
      </div>
    )
  }

}

export default Input
