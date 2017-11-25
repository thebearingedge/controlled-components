import { Component, createElement } from 'react'
import { func, string, number, oneOfType } from 'prop-types'
import { equalExcept, equalState, mapObject } from '../util'

const equalProps = equalExcept('name', 'children')

export default class FieldSet extends Component {
  constructor(...args) {
    super(...args)
    this.fields = {}
    this.fieldState = {}
    this.registerField = this.registerField.bind(this)
  }
  getChildContext() {
    const { registerField } = this
    return { registerField }
  }
  componentDidUpdate() {
    this.fieldState = mapObject(this.fields, key => ({
      ...this.fields[key]
    }))
  }
  shouldComponentUpdate(nextProps) {
    const { props, fields, fieldState } = this
    return !equalProps(props, nextProps) ||
           Object
             .keys(fields)
             .some(key => !equalState(fields[key], fieldState[key]))
  }
  registerField({ name, value }) {
    const field = this.context.registerField({
      name: `${this.props.name}.${name}`,
      value
    })
    this.fields[name] = field
    this.fieldState[name] = { ...field }
    return field
  }
  render() {
    return createElement('fieldset', this.props)
  }
}

FieldSet.propTypes = {
  name: oneOfType([string, number]).isRequired
}

FieldSet.contextTypes = {
  registerField: func
}

FieldSet.childContextTypes = {
  registerField: func
}
