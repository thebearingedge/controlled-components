import React, { Fragment } from 'react'
import { render } from 'react-dom'
import { Form, Field, FieldSet, FieldArray } from '~/src'

const handleSubmit = (errors, values, form) => {
  if (errors) {
    form.touchAll()
    return console.log(JSON.stringify(errors, null, 2))
  }
  console.log(JSON.stringify(form, null, 2))
}

const validateUsername = (value, _, field) => {
  if (value === field.value && field.isValid) return
  const username = value.trim()
  if (/\s/g.test(username)) {
    return { error: 'Username may not contain spaces.' }
  }
  if (!username) {
    return { error: 'Please choose a username.' }
  }
  if (username.length < 3) {
    return { error: 'Username must be at least three characters long.' }
  }
  return new Promise(resolve => {
    setTimeout(() => {
      Math.floor(Math.random() * 10) > 5
        ? resolve({ error: 'That username is taken.' })
        : resolve()
    }, 1500)
  })
}

const validateEmail = value =>
  !/\w+@\w+\.\w+/.test(value) &&
  { error: 'Please enter a valid email.' }

const validateFriends = (friends, values, fields, form) => {
  if (friends.length < 3) {
    return { error: 'Please name at least three friends.' }
  }
  if (form.isSubmitting && friends.some(friend => !friend.name.trim())) {
    return { error: 'Please name all friends.' }
  }
}

const validateFriendName = name =>
  !name.trim() &&
  { error: 'What is your friend\'s name?' }

const renderField = ({ field, control, ...props }) => {
  const showError = field.isInvalid &&
                    (field.isTouched || field.isAsyncValidated)
  const inputClass = showError
    ? 'form-control border-danger'
    : field.isValidating
      ? 'form-control border-warning'
      : field.isValid
        ? 'form-control border-success'
        : 'form-control'
  return (
    <div className='form-group row'>
      { props.label &&
        <label htmlFor={props.id} className="col-lg-2 col-form-label">
          { props.label }
        </label>
      }
      <div className="col-lg-10">
        <input id={props.id} className={inputClass} {...control}/>
        { field.isValidating &&
          <small className='text-warning'> ⏳ Checking...</small>
        }
        { field.isValid &&
          <small className='text-success'> 👍 Ok!</small>
        }
        { showError &&
          <small className='text-danger'> ❌ { field.error }</small>
        }
      </div>
    </div>
  )
}

const renderFriend = (friend, index, fields, key) =>
  <FieldSet name={index} key={key}>
    { _ =>
      <Field
        name='name'
        className={'form-control'}
        validate={validateFriendName}
        render={({ field, control }) => {
          const showError = field.isInvalid && field.isTouched
          const inputClass = showError
            ? 'form-control border-danger'
            : 'form-control'
          return (
            <Fragment>
              { showError &&
                <div>
                  <small className='text-danger'>{ field.error }</small>
                </div>
              }
              <div className='input-group form-group'>
                <input
                  type='text'
                  {...control}
                  placeholder='Name'
                  className={inputClass}/>
                <span className='input-group-btn'>
                  <button
                    type='button'
                    onClick={_ => fields.remove(index)}
                    className='btn btn-secondary'>
                    <i className='oi oi-x'/>
                  </button>
                </span>
              </div>
            </Fragment>
          )
        }}/>
    }
  </FieldSet>

const renderFriends = ({ fields }) =>
  <div className='form-group'>
    <legend><small>Friends ({ fields.length })</small></legend>
    { fields.isInvalid &&
      fields.isInactive &&
      <div className='alert alert-danger'>{ fields.error }</div>
    }
    { fields.map(renderFriend) }
    <button
      type='button'
      onClick={_ => fields.push({ name: '' })}
      className='btn btn-outline-success'>
      <i className='oi oi-plus'/>
    </button>
  </div>

const renderContactInfo = _ =>
  <fieldset>
    <legend><small>Contact Info</small></legend>
    <Field
      id='email'
      name='email'
      type='email'
      label='Email'
      render={renderField}
      validate={validateEmail}/>
  </fieldset>

class DemoForm extends Form {
  componentDidMount() {
    super.componentDidMount()
    window.form = this.model
  }
}

render(
  <DemoForm
    noValidate
    name='signUp'
    onSubmit={handleSubmit}
    render={({ form, control }) =>
      <form {...control} className='container'>
        <legend>Join Up!</legend>
        <Field
          id='username'
          name='username'
          label='Username'
          render={renderField}
          validate={validateUsername}/>
        <FieldSet
          name='contactInfo'
          className='form-group'
          render={renderContactInfo}/>
        <FieldArray
          name='friends'
          render={renderFriends}
          validate={validateFriends}/>
        <button type='reset' className='btn btn-outline-secondary'>
          Reset
        </button>
        { ' ' }
        <button type='submit' className='btn btn-primary'>
          Sign Up
        </button>
      </form>
    }/>,
  document.querySelector('#app')
)
