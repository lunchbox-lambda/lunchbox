import './style.scss'
import * as React from 'react'
import { Component } from 'components/common'
import { NavLink } from 'react-router-dom'
import { Button } from '@blueprintjs/core'

interface Props { }

interface State { }

export class Siderbar extends Component<Props, State> {

  render() {
    return (
      <div className="sidebar">

        <label className="pt-label">Overview</label>
        <NavLink to="/dashboard">
          <Button className="pt-minimal">
            <i className="fas fa-fw fa-tachometer-alt" />Dashboard
          </Button>
        </NavLink>
        <NavLink to="/diagnostics">
          <Button className="pt-minimal">
            <i className="fas fa-fw fa-heartbeat" />Diagnostics
          </Button>
        </NavLink>
        <NavLink to="/console-output">
          <Button className="pt-minimal">
            <i className="fas fa-fw fa-terminal" />Console Output
          </Button>
        </NavLink>

        <label className="pt-label">Computer</label>
        <NavLink to="/control-room">
          <Button className="pt-minimal">
            <i className="fas fa-fw fa-desktop" />Control Room
          </Button>
        </NavLink>
        <NavLink to="/architecture">
          <Button className="pt-minimal">
            <i className="fas fa-fw fa-microchip" />Architecture
          </Button>
        </NavLink>
        <NavLink to="/fixture-types">
          <Button className="pt-minimal">
            <i className="fas fa-fw fa-cogs" />Fixture Types
          </Button>
        </NavLink>
        <NavLink to="/variables">
          <Button className="pt-minimal">
            <i className="fas fa-fw fa-superscript" />Variables
          </Button>
        </NavLink>
        <NavLink to="/settings">
          <Button className="pt-minimal">
            <i className="fas fa-fw fa-sliders-h" />Settings
          </Button>
        </NavLink>

        <label className="pt-label">Recipes</label>
        <NavLink to="/recipe-book">
          <Button className="pt-minimal">
            <i className="fas fa-fw fa-book" />Recipe Book
          </Button>
        </NavLink>

      </div>
    )
  }

}
