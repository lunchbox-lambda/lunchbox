import './style.scss'
import app from 'lib/app'
import * as React from 'react'
import { Component } from 'components/common'
import * as ReactMarkdown from 'react-markdown'
import { Dictionary } from 'lodash'
import { Computer, Fixture, FixtureType } from '@lunchbox-lambda/client'
import { Button } from '@blueprintjs/core'
import { Toaster } from 'lib/toaster'
import { Observable } from 'rxjs'

const imageArduinoUno = require('assets/board_arduino_uno.svg')
const imageArduinoMega = require('assets/board_arduino_mega.svg')
const markdownArchitecture = require('assets/docs/architecture.md')

interface Props { }

interface State {
  isEditing: boolean
  computer: Computer
  description: string
  fixtureTypes: Dictionary<FixtureType>
}

export class ArchitectureComponent extends Component<Props, State> {

  private textArea: HTMLTextAreaElement

  constructor(props: Props) {
    super(props)

    this.state = {
      isEditing: false,
      computer: null,
      description: '',
      fixtureTypes: null
    }
  }

  componentDidMount() {
    this.handleSubscriptions([

      app.services.computer.get()
        .subscribe(computer => this.setState({ computer })),

      app.services.fixtureTypes.query()
        .subscribe(fixtureTypes => this.setState(
          { fixtureTypes: fixtureTypes.reduce((r, v) => (r[v.id] = v, r), {}) }
        )),

      Observable.fromPromise(
        fetch(markdownArchitecture)
          .then(response => response.text())
      ).subscribe(description => this.setState({ description }))

    ])
  }

  private onEditClick() {
    this.setState({ isEditing: true })
  }

  private onCancelClick() {
    this.setState({ isEditing: false })
  }

  private onSaveClick() {
    try {
      const fixtures = JSON.parse(this.textArea.value)

      this.handleSubscriptions([
        app.services.computer.updateComputerFixtures(fixtures)
          .subscribe(() => {
            const computer = this.state.computer
            computer.fixtures = fixtures
            this.setState({ isEditing: false, computer })
            Toaster.success('Fixtures updated successfuly.')
          }, Toaster.error)
      ])

    } catch (error) { Toaster.error(error) }
  }

  render() {
    const isReady = this.state.computer && this.state.fixtureTypes

    return (
      <div className='content content-architecture'>
        <div className='flex-row'>
          <div className='flex-column'>
            <div className='flex-row' style={ { flex: '0 0 auto' } }>
              <h4>Architecture</h4>
              { !isReady ? null : this.renderActionBar() }
            </div>
            {
              !isReady ? null :
                !this.state.isEditing ? this.renderFixturesTable() : this.renderTextArea()
            }
          </div>
          <div style={ { flex: '0 0 400px' } }>
            {
              !isReady ? null :
                this.state.isEditing ? this.renderDescription() : this.renderBoardImage()
            }
          </div>
        </div>
      </div>
    )
  }

  private renderActionBar() {
    return (
      <div className='action-bar'>
        {
          !this.state.isEditing ?
            <div>
              <Button className='pt-small' onClick={ this.onEditClick.bind(this) }>Edit</Button>
            </div>
            :
            <div>
              <Button className='pt-small' onClick={ this.onCancelClick.bind(this) }>Cancel</Button>
              <Button className='pt-small pt-intent-primary' onClick={ this.onSaveClick.bind(this) }>Save</Button>
            </div>
        }
      </div>
    )
  }

  private renderFixturesTable() {
    const { fixtures } = this.state.computer
    const fixturesByEnv = fixtures.reduce((r, v, i, a, k = v.env) =>
      ((r[k] || (r[k] = [])).push(v), r), {})

    return (
      Object.keys(fixturesByEnv).sort().map(key =>
        <div key={ key } className='environment-section'>
          <h6>Environment - { key }</h6>
          <table className='pt-table pt-condensed pt-striped'>
            <thead>
              <tr>
                <th style={ { width: '75px' } }>Type</th>
                <th style={ { width: '100px' } }>Pin \ Dev</th>
                <th style={ { width: '125px' } }>ID</th>
                <th>Input \ Output \ Params</th>
              </tr>
            </thead>
            <tbody>
              { fixturesByEnv[key].map(fixture => this.renderFixtureRow(fixture)) }
            </tbody>
          </table>
        </div>
      )
    )
  }

  private renderFixtureRow(fixture: Fixture) {
    const fixtureType = this.state.fixtureTypes[fixture.type]
    if (!fixtureType) return null

    const inputs = fixtureType.inputs
    const outputs = fixtureType.outputs
    const params = fixture.params

    return (
      <tr key={ fixture.id } className={ fixture.disabled ? 'disabled' : null }>
        <td style={ { textAlign: 'center', verticalAlign: 'middle' } }>
          <div>
            { fixtureType.type === 'sensor' ? <i className='fas fa-rss'></i> : null }
            { fixtureType.type === 'actuator' ? <i className='fas fa-cogs'></i> : null }
            { fixtureType.type === 'regulator' ? <i className='fas fa-power-off'></i> : null }
            { fixtureType.type === 'camera' ? <i className='fas fa-camera'></i> : null }
          </div>
          <div style={ { color: 'gray' } }>{ fixtureType.type }</div>
        </td>
        <td style={ { textAlign: 'center', verticalAlign: 'middle' } }>
          {
            fixture.pin ? <div style={ { fontSize: '1.25em' } }>{ fixture.pin }</div> :
              fixture.dev ? <div>{ fixture.dev }</div> : null
          }

        </td>
        <td>
          <div style={ { fontWeight: 'bold' } }>{ fixture.id }</div>
          <div style={ { color: 'gray' } }>{ fixtureType.id }</div>
        </td>
        <td>
          {
            !inputs ? null : inputs.map(input =>
              <div key={ input }>{ `${fixture.env}::${input}` }</div>
            )
          }
          {
            !outputs ? null : outputs.map(output =>
              <div key={ output }>{ `${fixture.env}::${output}` }</div>
            )
          }
          {
            !params ? null : Object.keys(params).map(key =>
              <div key={ key }>{ `${key}: ${params[key]}` }</div>
            )
          }
        </td>
      </tr>
    )
  }

  private renderTextArea() {
    const { fixtures } = this.state.computer

    return (
      <textarea
        ref={ textarea => { this.textArea = textarea } }
        className='pt-input pt-fill'
        defaultValue={ JSON.stringify(fixtures, null, '    ') }
        rows={ 10 }
        spellCheck={ false }>
      </textarea>
    )
  }

  private renderDescription() {
    return (
      <div className='description-container'>
        <ReactMarkdown source={ this.state.description } />
      </div>
    )
  }

  private renderBoardImage() {
    const { boardType } = this.state.computer

    let boardImage
    if (boardType === 'megaatmega2560') boardImage = imageArduinoMega
    if (boardType === 'uno') boardImage = imageArduinoUno

    return (
      <div className='board-image-container'>
        <img src={ boardImage } />
      </div>
    )
  }

}
