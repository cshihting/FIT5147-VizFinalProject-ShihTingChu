!(function (d3) {

$("rain_content").empty();

var margin = {top: 20, right: 40, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// setup x 
var xValue = function(d) { return d['year'];},
    xScale = d3.scale.linear().range([0, width]),
    xMap = function(d) { return xScale(xValue(d));},
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y (left)
var yValue = function(d) { return d['rainfall(MM)'];},
    yScale = d3.scale.linear().range([height, 0]),
    yMap = function(d) { return yScale(yValue(d));},
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup y2 (right)
var y2Value = function(d) { return d['suicide_per_100k'];},
    y2Scale = d3.scale.linear().range([height, 0]),
    y2Axis = d3.svg.axis().scale(y2Scale).orient("right");
    
// setup lines
var line = d3.svg.line()
                .x(function(d) { return xScale(d['year']); })
                .y(function(d) { return y2Scale(d['suicide_per_100k']); });

// setup fill color
var cValue = function(d) { return d['country'];},
    color = d3.scale.category10();

// add the graph canvas to the body of the webpage
var svg = d3.select("rain_content")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("rain_content")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

// load data
d3.csv("../CSV/rain.csv", function(error, data) {

    // change string (from CSV) into number format
    data.forEach(function(d) {
        d['year'] = +d['year'];
        d['rainfall(MM)'] = +d['rainfall(MM)'];
        d['suicide_per_100k'] = +d['suicide_per_100k'];
    //    console.log(d);
    });

    // don't want plots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);
    y2Scale.domain([d3.min(data, y2Value)-1, d3.max(data, y2Value)+1]);

    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Year");

    // y-axis (left: rainfall)
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Rainfall - (MM)");

    // y-axis (right: suicide rate)
    svg.append("g")
        .attr("class", "y axis")
        .call(y2Axis)
        .attr("transform", "translate(" + width + ",0)")
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 2)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Suicide Rate (per 100k)");

    // Nest the line entries by country
    var dataNest = d3.nest()
                    .key(function(d) {return d['country'];})
                    .entries(data);

    // loop through each country (draw lines)
    dataNest.forEach(function(d) {
        svg.append("path")
            .attr("class", "line")
            .style("stroke", function() { // Add colors dynamically
                return d.color = color(d.key); })
            .attr("d", line(d.values))
    });

    // draw circles
    svg.selectAll("circle")
        .data(data).enter() // create place holders if the data are new
        .append("circle") // create one circle for each
        // calculate the centres of circles 
        .attr("r", 7)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d) { return color(cValue(d));}) 
        // setup mouse motion
        .on("mouseover", function(d) {
            tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);
            // setup tooltip displayed location
            tooltip.html(d['country'] + "<br/> Year: " + xValue(d)
            + "<br/> Rainfall(MM): " + Math.ceil(yValue(d)))
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            // grey out all circles
            svg.selectAll("circle")
                .style("opacity", 0.3);
            // grey out all lines
            svg.selectAll("path")
                .style("opacity", 0.3);
            // hightlight the on hovering on
            d3.select(this)
                .style("opacity", 1);
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            // restore all circles to normal mode
            svg.selectAll("circle") 
                .style("opacity", 1);
            // restore all lines to normal mode
            svg.selectAll("path") 
                .style("opacity", 1);
            // restore all legends to normal mode
            svg.selectAll(".legend") 
                .style("opacity", 1);
        });

    // draw legend
    var legend = svg.selectAll(".legend")
                    .data(color.domain())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // draw legend colored rectangles
    legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color)

    // draw legend text
    legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d;})
    
    // add actions when the legend is clicked
    legend.on("click", function(selected_country) {
        // dim all of the icons in legend
        d3.selectAll(".legend")
            .style("opacity", 0.1);
        // make the one selected be un-dimmed
        d3.select(this)
            .style("opacity", 1);
        // select all dots and highlight the selected one
        d3.selectAll("circle")
            .style("opacity", 0.2)
            // filter out the ones we want to show and apply properties
            .filter(function(d) {
                return d["country"] == selected_country;
            })
            .style("opacity", 1);
        // select all lines and highlight the selected one
        d3.selectAll("path")
            .style("opacity", 0.2)
            // filter out the ones we want to show and apply properties
            .filter(function(d) {
                return d["country"] == selected_country;
            })
            .style("opacity", 1); ////////////// didn't work!????!
    });
});

})(d3);