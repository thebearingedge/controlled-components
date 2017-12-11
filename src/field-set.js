import { createElement } from 'react'
import { oneOfType, func, object, string } from 'prop-types'
import * as _ from './util'
import * as SuperControl from './super-control'

export class FieldSet extends SuperControl.View {
  getInit() {
    return this.props.init
  }
  getState() {
    return _.pick(this.model, ['init', 'value', 'touched'])
  }
  modelField(...args) {
    return modelFieldSet(...args)
  }
  render() {
    const { init, notify, validate, component, ...props } = this.props
    if (_.isString(component)) return createElement(component, props)
    return createElement(component, {
      ...props,
      fields: this.model
    })
  }
  static get propTypes() {
    return {
      ...super.propTypes,
      init: object,
      component: oneOfType([string, func]).isRequired
    }
  }
  static get defaultProps() {
    return {
      ...super.defaultProps,
      init: {},
      component: 'fieldset'
    }
  }
}

export class FieldSetModel extends SuperControl.Model {
  constructor(...args) {
    super(...args)
    this.fields = {}
  }
  get touched() {
    return this.form.getTouched(this.path, {})
  }
  get isTouched() {
    return _.someValues(this.touched, _.id)
  }
  register(field, [ key, ...path ]) {
    this.fields = path.length
      ? _.set(this.fields, [key], this.fields[key].register(field, path))
      : _.set(this.fields, [key], field)
    return this
  }
  check(value, values, method, [ key, ...path ]) {
    return _.assign(
      super.check(_.set(this.value, [key, ...path], value), values, method),
      this.fields[key].check(value, values, method, path)
    )
  }
}

export const modelFieldSet = (...args) => new FieldSetModel(...args)
