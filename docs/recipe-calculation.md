# Recipe calculation

## Current scope

The calculator scales a sourdough recipe to a requested final dough weight.
For the first version, the recipe contains only flour, water, starter, and salt.

The user provides:

- final dough weight in grams;
- true dough hydration as a percentage;
- starter amount as a baker's percentage;
- salt as a baker's percentage.

Starter is assumed to be 100% hydrated: equal weights of flour and water. The
calculation keeps the starter composition explicit so a configurable starter
hydration can be added later without changing the underlying model.

Hydration means total water divided by total flour, including the flour and
water contained in the starter. Added water is therefore a calculated result,
not an independent input.

Input validation and extra ingredients are intentionally outside the current
calculation.

## Formula

```javascript
function calculateIngredients({ weight, hydration, starter, salt }) {
  const starterFlour = starter / 2;
  const starterWater = starter / 2;

  const water = (hydration / 100) * (100 + starterFlour) - starterWater;

  const factor = 100 + water + starter + salt;
  const multiplier = weight / factor;

  return {
    hydration,

    flour: 100 * multiplier,
    water: water * multiplier,

    starter: {
      total: starter * multiplier,
      flour: starterFlour * multiplier,
      water: starterWater * multiplier,
    },

    salt: salt * multiplier,
  };
}
```

Although starter hydration is fixed in the public interface, the generalized
starter split is:

```javascript
const ratio = starterHydration / 100;
const starterFlour = starter / (1 + ratio);
const starterWater = starter - starterFlour;
```

## Displaying hydration

The requested hydration can be displayed directly because it is an input and
the source of truth. It can also be verified from the calculated weights:

```javascript
const actualHydration =
  ((ingredients.water + ingredients.starter.water) /
    (ingredients.flour + ingredients.starter.flour)) *
  100;
```

For clarity, a result may show the starter's composition in grams:

```text
Starter: 105.82 g
  Flour: 52.91 g
  Water: 52.91 g
```

The internal baker's percentages of starter flour and starter water do not
need to be exposed as user inputs.
