### Case study 2: Data visualisation

Four example data visualisations are provided below.

These visualisations were created with Python. The task today us to
implement similar visualisations in JavaScript using p5.js.

![diversity-race](https://www.doc.gold.ac.uk/~jfort010/ip/case-studies/data-vis/figures/diversity-race-facebook.svg)

![diversity-gender](https://www.doc.gold.ac.uk/~jfort010/ip/case-studies/data-vis/figures/diversity-tech-gender.svg)

![paygapByJob2017](https://www.doc.gold.ac.uk/~jfort010/ip/case-studies/data-vis/figures/pay-gap-by-job-2017.svg)

![payGapTimeSeries](https://www.doc.gold.ac.uk/~jfort010/ip/case-studies/data-vis/figures/pay-gap-timeseries.svg)

#### Tasks

Download the data vis project
[template](https://www.doc.gold.ac.uk/~jfort010/ip/case-studies/data-vis/data-vis.zip)
and look over the code.

#### Pay gap by job 2017

Read through the file `pay-gap-by-job-2017.js`.

At line 65, complete the `for` loop that draws all of the data points
on the canvas.

    - x = proportion of female employees.
    - y = pay gap
    - size = number of jobs

#### Tech diversity: Race

Complete the `draw()` function in `tech-diversity-race.js`.

1. Look up the documentation for [Table](https://p5js.org/reference/#/p5.Table).

2. Loop at the raw data: `./data/tech-diversity/race-2018.csv`. Maybe
   in a spreadsheet program.

3. Using `console.log`, extract the data from the table and store it
   in the variables required by the `PieChart` draw method (`col`,
   `labels`, `colours`, `title`).

4. Write a helper function caled `stringsToNumbers` that takes an
   array of number represented as strings, and converts them all to
   numbers.

5. Pass all your variables to the `PieChart` `draw` method.

6. Based on the p5.js example
   [here](https://p5js.org/examples/form-pie-chart.html), complete the
   draw method in `pie-chart.js`. You method should be better than
   this example! It should be able to use all of the parameter and
   plot them in the canvas.

    Note the following hack.

    ``` js
        arc(
            this.x, this.y,
            this.diameter, this.diameter,
            lastAngle, lastAngle + angles[i] + 0.001 // Hack for 0!
        );
    ```

7. Create a select DOM element using p5.dom.js and populate options
   using company names so that selecting a company name from the list
   draws the correspond data.
