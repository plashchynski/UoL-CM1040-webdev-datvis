### Case study 2: Data visualisation

Two example data visualisations are provided below.

These visualisations were created with Python. The task today is to
implement similar visualisations in JavaScript using p5.js.

![paygapByJob2017](https://www.doc.gold.ac.uk/~jfort010/ip/case-studies/data-vis/figures/pay-gap-by-job-2017.svg)

![diversity-race](https://www.doc.gold.ac.uk/~jfort010/ip/case-studies/data-vis/figures/diversity-race-facebook.svg)

#### Tasks

Download the data vis project template from the bottom of this page
and look over the code.

#### Pay gap by job 2017

Read through the file `pay-gap-by-job-2017.js`.

At line 75, complete the `for` loop that draws all of the data points
on the canvas.

    - x = proportion of female employees.
    - y = pay gap
    - size = number of jobs

#### Tech diversity: Race

Complete the `draw()` function in `tech-diversity-race.js`.

1. Look up the documentation for [Table](https://p5js.org/reference/#/p5.Table).

2. Look at the raw data: `./data/tech-diversity/race-2018.csv`. Maybe
   in a spreadsheet program.

3. Extract the relevant data from the table (`this.data`) and store it
   in the variables required by the `PieChart` `draw` method (`col`,
   `labels`). Check each variable contains the correct data using
   `console.log`.

4. Create a `colours` array containing colour values that will be used
   to specify the respective colour of each pie chart segment.

5. Create a title for your plot and assign it to the `title`
   variable. You should build a string using the `companyName`
   variable so that the title will automatically contain the correct
   company name when a different company is selected.

6. Pass all your variables to the `PieChart` `draw` method.

7. Based on the p5.js example
   [here](https://p5js.org/examples/form-pie-chart.html), complete the
   draw method in `pie-chart.js`. Your method should be better than
   this example! It should be able to use all of the parameter
   (`data`, `labels`, `colours`, `title`) and plot them correctly on
   the canvas. Display the `labels` data alongside the pie chart in a
   legend showing the viewer which colour in the chart corresponds to
   each race.

    Note the following hack.

    ``` js
        arc(
            this.x, this.y,
            this.diameter, this.diameter,
            lastAngle, lastAngle + angles[i] + 0.001 // Hack for 0!
        );
    ```

    - Advanced version: Instead of a legend, try plotting the labels
      next to the corresponding slice.

8. Create a select DOM element using p5.dom.js (see
   [`createSelect`](https://p5js.org/reference/#/p5/createSelect)) and
   populate the options programmatically using the company names
   obtained from `this.data`.
   - Hint: you need a `for` loop.

9. Test that when selecting a company name from the list the correct
   data is visualised on the canvas and the correct title is
   generated.

### Further work

The following two visualisation are on the same topics, and the data
is available in the template project. Try and create similar
visualisations in p5.

![diversity-gender](https://www.doc.gold.ac.uk/~jfort010/ip/case-studies/data-vis/figures/diversity-tech-gender.svg)

![payGapTimeSeries](https://www.doc.gold.ac.uk/~jfort010/ip/case-studies/data-vis/figures/pay-gap-timeseries.svg)
