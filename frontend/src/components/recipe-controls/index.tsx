import './style.scss'
import app from 'lib/app'
import * as React from 'react'
import { Component } from 'components/common'
import { Button, Tag, Intent } from '@blueprintjs/core'
import { RecipeOption, RecipeContext, RecipeCommand, RecipeStatus } from '@lunchbox-lambda/client'

interface Props { }

interface State {
  environments: string[]
  recipes: RecipeOption[]
  selectedRecipeIds: Map<string, string>
  recipeContexts: { [environment: string]: RecipeContext }
}

export class RecipeControlsComponent extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      recipes: [],
      environments: [],
      recipeContexts: null,
      selectedRecipeIds: new Map()
    }
  }

  componentDidMount() {
    this.handleSubscriptions([

      app.services.recipes.options()
        .subscribe(recipes => this.setState({ recipes })),

      app.store.getRecipeContexts()
        .subscribe(recipeContexts => this.setState({ recipeContexts },
          () => this.updateSelectedRecipeIds())
        ),

      app.store.getEnvironmentList()
        .subscribe(environments => this.setState({ environments }))
    ])
  }

  private updateSelectedRecipeIds() {
    const { recipeContexts, selectedRecipeIds } = this.state;
    Object.keys(recipeContexts).forEach(key => {
      const value = recipeContexts[key]
      selectedRecipeIds.set(key, value.recipeId)
    })
    this.setState({ selectedRecipeIds })
  }

  private commandRecipe(environment: string, command: RecipeCommand) {
    const { recipeContexts, selectedRecipeIds } = this.state
    const { status } = recipeContexts[environment]
    const recipeId = selectedRecipeIds.get(environment)

    switch (command) {

      case RecipeCommand.START:
        app.services.environment.startRecipe(environment, recipeId)
        break

      case RecipeCommand.PAUSE:
        app.services.environment.pauseRecipe(environment)
        break

      case RecipeCommand.RESUME:
        app.services.environment.resumeRecipe(environment)
        break

      case RecipeCommand.STOP: {
        if (!window.confirm('Are you sure?')) return
        app.services.environment.stopRecipe(environment)
      } break

      case RecipeCommand.EJECT: {
        if (status == RecipeStatus.NO_RECIPE) {
          selectedRecipeIds.set(environment, '')
          this.setState({ selectedRecipeIds })
        } else
          app.services.environment.ejectRecipe(environment)
      } break
    }
  }

  private isCommandEnabled(environment: string, command: RecipeCommand) {
    const { recipeContexts, selectedRecipeIds } = this.state
    const { status } = recipeContexts[environment]
    const recipeId = selectedRecipeIds.get(environment)

    switch (command) {

      case RecipeCommand.START:
        return !!recipeId &&
          (status !== RecipeStatus.RUNNING &&
            status !== RecipeStatus.PAUSED)

      case RecipeCommand.PAUSE:
        return status === RecipeStatus.RUNNING

      case RecipeCommand.RESUME:
        return status === RecipeStatus.PAUSED

      case RecipeCommand.STOP:
        return status === RecipeStatus.RUNNING ||
          status === RecipeStatus.PAUSED

      case RecipeCommand.EJECT:
        return status !== RecipeStatus.RUNNING &&
          status !== RecipeStatus.PAUSED
    }
  }

  private renderRecipePanel(environment: string) {
    const { recipes, recipeContexts, selectedRecipeIds } = this.state
    if (!recipeContexts || !recipeContexts[environment]) return null
    const { status } = recipeContexts[environment]

    let recipeStatusTag
    switch (status) {

      case RecipeStatus.NO_RECIPE:
        recipeStatusTag = <Tag intent={ Intent.NONE }>no recipe</Tag>
        break

      case RecipeStatus.RUNNING:
        recipeStatusTag = <Tag intent={ Intent.SUCCESS }>running</Tag>
        break

      case RecipeStatus.PAUSED:
        recipeStatusTag = <Tag intent={ Intent.WARNING }>paused</Tag>
        break

      case RecipeStatus.STOPPED:
        recipeStatusTag = <Tag intent={ Intent.NONE }>stopped</Tag>
        break

      case RecipeStatus.FINISHED:
        recipeStatusTag = <Tag intent={ Intent.NONE }>finished</Tag>
        break

      case RecipeStatus.ERROR:
        recipeStatusTag = <Tag intent={ Intent.DANGER }>error</Tag>
        break
    }

    const selectionEnabled =
      status === RecipeStatus.NO_RECIPE ||
      status === RecipeStatus.STOPPED

    return (
      <div key={ environment } className='pt-card control-panel recipe-panel'>
        <div className='flex-row' style={ { justifyContent: 'space-between', alignItems: 'center' } }>
          <h6>Recipe - { environment }</h6>
          <span style={ { position: 'relative', top: '-5px' } }>{ recipeStatusTag }</span>
        </div>
        <div>
          <div className='flex-row'>
            <div className='pt-select pt-fill'>
              <select
                disabled={ !selectionEnabled }
                value={ selectedRecipeIds.get(environment) }
                onChange={ event => {
                  selectedRecipeIds.set(environment, event.target.value)
                  this.setState({ selectedRecipeIds })
                } }>
                <option key={ null } value=''>Select recipe...</option>
                { recipes.map(recipe =>
                  <option key={ recipe.id } value={ recipe.id }>{ recipe.name }</option>
                ) }
              </select>
            </div>
            <div className='separator' />
            <div>
              <Button
                disabled={ !this.isCommandEnabled(environment, RecipeCommand.EJECT) }
                onClick={ () => this.commandRecipe(environment, RecipeCommand.EJECT) }>
                <i className="fas fa-eject" />
              </Button>
            </div>
          </div>
          <div className='flex-row' style={ { marginTop: '10px' } }>
            <div>
              <Button className='pt-fill'
                disabled={ !this.isCommandEnabled(environment, RecipeCommand.START) }
                onClick={ () => this.commandRecipe(environment, RecipeCommand.START) }>
                <i className="fas fa-play" />
              </Button>
            </div>
            <div className='separator' />
            <div>
              <Button className='pt-fill'
                disabled={ !this.isCommandEnabled(environment, RecipeCommand.PAUSE) }
                onClick={ () => this.commandRecipe(environment, RecipeCommand.PAUSE) }>
                <i className="fas fa-pause" />
              </Button>
            </div>
            <div className='separator' />
            <div>
              <Button className='pt-fill'
                disabled={ !this.isCommandEnabled(environment, RecipeCommand.RESUME) }
                onClick={ () => this.commandRecipe(environment, RecipeCommand.RESUME) }>
                <i className="fas fa-eject" data-fa-transform="rotate-90" />
              </Button>
            </div>
            <div className='separator' />
            <div>
              <Button className='pt-fill'
                disabled={ !this.isCommandEnabled(environment, RecipeCommand.STOP) }
                onClick={ () => this.commandRecipe(environment, RecipeCommand.STOP) }>
                <i className="fas fa-stop" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return this.state.environments.map(
      environment => this.renderRecipePanel(environment)
    )
  }

}
