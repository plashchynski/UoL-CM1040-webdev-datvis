## IDEAS

- diversity: gender
  - sorted stacked bar
- pay gap animation
- global surface temperature


## Case study 2: Data visualisation

### Tasks

Download the data vis project template from the bottom of this page
and look over the code.

#### Tech diversity: Gender [2 marks]

![tech-diversity-gender](https://www.doc.gold.ac.uk/~jfort010/ip/case-studies/data-vis/figures/tech-diversity-gender.png)

Complete the `draw()` method to create a stacked bar chart by adding
the proportion of men employed at each company.

1. Look up the documentation for [Table](https://p5js.org/reference/#/p5.Table).

2. Look at the raw data: `./data/tech-diversity/gender-2018.csv`. Maybe
   in a spreadsheet program.

3. Extract the relevant data from the table (`this.data`) and store it
   in the `company` variable.

4. Look at how the rectangle representing the proportion of female
   employees is defined. Draw a rectangle representing the male
   proportion using the parameters and methods defined in this
   object.

#### Pay gap 1997–2017 [2 marks]

![paygapByJob2017](https://www.doc.gold.ac.uk/~jfort010/ip/case-studies/data-vis/figures/pay-gap-1997-2017.png)

Complete the `draw()` method to create a line graph representing the
pay gap between female and male employees.

1. Look at the raw data:
   `./data/pay-gap/all-employees-hourly-pay-by-gender-1997-2017.csv`. Maybe
   in a spreadsheet program.

2. Extract the relevant data from the table (`this.data`) and store it
   in the `current` variable.

3. Complete the `mapPayGapToHeight()` method. Look at how `mapYearToWidth()`
   works.

4. Complete the `line()` function in the `draw()` method to plot the
   pay gap over time. You will need to use both `mapPayGapToHeight()`
   and `mapYearToWidth()` methods.

#### Climate change [2 marks]

![climateChange](https://www.doc.gold.ac.uk/~jfort010/ip/case-studies/data-vis/figures/climate-change.png)

1. Using the `mapTemperatureToColour()` method set the `fill()` in the
   `draw()` method. You need to pass the current temperature to this
   method to get the correct colour.

2. Complete the `rect()` function below the `fill()` to create a
   gradient effect background (thinly-sliced rectangles across the
   x-axis). All of the values you need are already calculated within
   this visualisation object – you need to find them!

#### Tech diversity: Race [2 marks]

![tech-diversity-race](https://www.doc.gold.ac.uk/~jfort010/ip/case-studies/data-vis/figures/tech-diversity-race.png)

Complete the `draw()` function in `tech-diversity-race.js`.

1. Look at the raw data: `./data/tech-diversity/race-2018.csv`. Maybe
   in a spreadsheet program.

2. Create a select DOM element using p5.dom.js (see
   [`createSelect`](https://p5js.org/reference/#/p5/createSelect)) and
   populate the options programmatically using the company names
   obtained from `this.data`.
   - Hint: you need a `for` loop.

3. Change the hard-coded company name to get the value from the
   select.

4. Test that when selecting a company name from the list the correct
   data is visualised on the canvas and the correct title is
   generated.

#### Pay gap by job 2017 [2 marks]

![paygapByJob2017](https://www.doc.gold.ac.uk/~jfort010/ip/case-studies/data-vis/figures/pay-gap-by-job.png)

Read through the file `pay-gap-by-job-2017.js`.

At line 80, complete the `for` loop that draws all of the data points
on the canvas as ellipses with the following properties.

    - x = proportion of female employees.
    - y = pay gap
    - size = number of jobs
