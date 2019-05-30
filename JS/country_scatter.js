!(function (d3) {

$("country_content").empty();

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// setup x 
var xValue = function(d) { return d.year;}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d.suicide_per_100k;}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function(d) { return d.country;},
    color = d3.scale.category10();

// add the graph canvas to the body of the webpage
var svg = d3.select("country_content").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("country_content").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.csv("../CSV/country_year.csv", function(error, data) {

    // change string (from CSV) into number format
    data.forEach(function(d) {
        d.year = +d.year;
        d.suicide_per_100k = +d.suicide_per_100k;
    //    console.log(d);
    });

    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

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

    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Suicide_per_100k");

    svg.selectAll("circle")
        .data(data).enter() // create place holders if the data are new
        .append("circle") // create one circle for each
        // calculate the centres of circles 
        .attr("r", 8)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d) {return color(cValue(d));})
        // setup mouse motion
        .on("mouseover", function(d) {
            tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);
            // setup tooltip displayed location
            tooltip.html(d.country + "<br/> Year: " + xValue(d)
            + "<br/> Suicide Rate: " + Math.ceil(yValue(d)))
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            // grey out all circles
            svg.selectAll("circle")
                .style("opacity", 0.1);
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
        });
});

})(d3);