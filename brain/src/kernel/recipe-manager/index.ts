import { Component } from 'lib/component'
import { Observable } from 'rxjs'
import { RecipeEvent } from 'kernel/recipe-manager/recipe-event'
import { RecipeContext } from 'kernel/recipe-manager/recipe-context'
import { RecipeCommand } from 'models'

export interface RecipeManager extends Component {
  recipeEvents: Observable<RecipeEvent>
  recipeContexts: Map<string, RecipeContext>
  command(environment: string, command: RecipeCommand, recipeId?: string)
}
