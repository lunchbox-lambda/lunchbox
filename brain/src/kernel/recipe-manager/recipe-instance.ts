import * as moment from 'moment';
import { Recipe } from 'models';

export class RecipeInstance {

  public name: string
  public recipeId: string
  public duration: number = 0
  public offsets: number[] = []
  public phases: RecipePhase[] = []
  public timeSeries: Map<number, RecipePoint> = new Map()

  public constructor(recipe: Recipe) {
    this.name = recipe.name;
    this.recipeId = recipe.id;

    let offset = 0;

    for (let phase of recipe.phases) {
      const recipePhase = new RecipePhase(phase.name);
      this.phases.push(recipePhase);

      for (let i = 0; i < phase.cycles; i++) {
        let daylength = 24 * 3600;
        const { dawn, day, dusk, night } = phase.dayparts;

        // Ensure the right daypart order
        const dayparts = [dawn, day, dusk, night];

        for (let daypart of dayparts) {
          if (!daypart) continue;

          const daypartIndex = dayparts.indexOf(daypart);
          const { duration, variables } = daypart;
          const daypartDuration = moment.duration(duration).asSeconds();

          const recipePoint = new RecipePoint(
            offset,
            recipePhase,
            daypartIndex as RecipeDaypart,
            new Map(Object.entries(variables))
          );

          this.timeSeries.set(offset, recipePoint);

          offset += daypartDuration;
          daylength -= daypartDuration;
        }

        // Check the overall duration of this day
        if (daylength < 0) throw new Error('Daylength exceeded!');
        else offset += daylength;
      }
    }

    this.duration = offset;

    this.offsets = Array
      .from(this.timeSeries, ([key]) => key)
      .sort((a, b) => a - b);
  }
}

export enum RecipeDaypart {
  DAWN, DAY, DUSK, NIGHT
}

export class RecipePhase {
  public constructor(public name: string) { }
}

export class RecipePoint {
  public constructor(
    public offset: number,
    public recipePhase: RecipePhase,
    public recipeDaypart: RecipeDaypart,
    public variableValues: Map<string, number>) { }
}
