<!-- Define margins  -->
var margin = { top: 20, right: 10, bottom: 150, left: 50},
  width = 800 -margin.right - margin.left,
  height = 620 - margin.top - margin.bottom;

<!-- Define svg -->
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

<!-- reminder, fixed syntax to make axis text work-->
var xScale = d3.scaleBand()
  .rangeRound([0,width])
  .padding(0.2);
var yScale = d3.scaleLinear()
  .range([height, 0]);
var xAxis = d3.axisBottom(xScale)
var yAxis = d3.axisLeft(yScale)

<!-- Import data -->
d3.csv("vgsales.csv").then(function(data) {

  data.forEach(function(d) {
    d.Name = d.Name;
    d.Global_Sales = +d.Global_Sales; <!-- convert Strings to numbers -->
    console.log(d.Global_Sales); <!-- to check global_sales conversion -->
  });

  <!-- sort data points by ascending release date -->
  data.sort(function(a,b) {
    return a.Year - b.Year;
  });

  <!-- label axes using data name and sales  -->
  xScale.domain(data.map(function(d) { return d.Name; }) );
  yScale.domain([0, d3.max(data, function(d) { return d.Global_Sales; } ) ]);

  <!-- create bars -->
  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    <!-- Added short animation at beginning -->
    .attr("height", 0)
    .attr("y", height)
    .transition().duration(2000)
    .delay(function(d,i) { return i * 100; })
    <!-- End animation -->
    .attr("x", function(d) { return xScale(d.Name); })
    .attr("y", function(d) { return yScale(d.Global_Sales); })
    .attr("width", xScale.bandwidth() + 2)
    .attr("height", function(d) { return height - yScale(d.Global_Sales); })
    .style("fill", "steelblue");

    <!-- style text above bars -->
    svg.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .text(function(d) { return d.Global_Sales; })
            .attr("x", function(d) { return xScale(d.Name) +  xScale.bandwidth()/2; })  //positions in middle of bar
            .attr("y", function(d) { return yScale(d.Global_Sales) + 12; }) //positions atop bar
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .style("font-family", "sans-serif")
            .style("fill", "AliceBlue")
            .style("text-anchor", "middle");

    <!-- draw x axis -->
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .attr("transform", "rotate(-55)")
        .style("text-anchor", "end")
        .attr("font-size", "10px");

    <!--draw and label y axis -->
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        //.append("text")
        .select("text")
        .attr("dx", "+10em")
        .attr("dy", ".25em")
        .attr("transform", "rotate(-90)")
        //.attr("x", -height/2)
        .attr("dy", "-3em")
        .style("text-anchor", "start")
        .text("Units Sold Globally (Millions)");

});
