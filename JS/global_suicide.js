var svg = d3.select("svg"),
    margin = 200,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin;

svg.append("text")
    .attr("transform", "translate(100,0)")
    .attr("x", 50)
    .attr("y", 50)
    .attr("font-size", "24px")
    .text("Sucides per 100K over Time");

var x = d3.scaleBand().range([0, width]).padding(0.4),
    y = d3.scaleLinear().range([height, 0]);


var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");


//mouseover event handler function
function onMouseOver(d, i) {
    d3.select(this).attr('class', 'highlight');
    d3.select(this)
    .transition()     // adds animation
    .duration(400)
    .attr('width', x.bandwidth() + 5)
    .attr("y", function(d) { return y(d.suicides_per_100k) - 10; })
    .attr("height", function(d) { return height - y(d.suicides_per_100k) + 10; });

    g.append("text")
    .attr('class', 'val') 
    .attr('x', function() {
        return x(d.year);
    })
    .attr('y', function() {
        return y(d.suicides_per_100k) - 15;
    })
    .text(function() {
        return [ d.suicides_per_100k];  // suicides_per_100k of the text
    });
}

//mouseout event handler function
function onMouseOut(d, i) {
    // use the text label class to remove label on mouseout
    d3.select(this).attr('class', 'bar');
    d3.select(this)
    .transition()     // adds animation
    .duration(400)
    .attr('width', x.bandwidth())
    .attr("y", function(d) { return y(d.suicides_per_100k); })
    .attr("height", function(d) { return height - y(d.suicides_per_100k); });

    d3.selectAll('.val')
    .remove()
}

function goBack() {
    window.history.back();
}