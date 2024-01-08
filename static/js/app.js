const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

d3.json(url).then(function(data) {
    console.log(data);
});

function init() {

    let dropdownMenu = d3.select('#selDataset');

    d3.json(url).then((data) => {

        let names = data.names;

        names.forEach((name) => {
            dropdownMenu.append('option').text(name).property('value');
        });

        let name = names[0];

        barChart(name);
        bubbleChart(name);
        demoInfo(name);

    });
};

function barChart(sample) {

    d3.json(url).then((data) => {

        let info = data.samples;

        let value = info.filter(result => result.id == sample);

        let bar_data = value[0];

        let trace1 = {
            x: bar_data.sample_values.slice(0,10).reverse(),
            y: bar_data.otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse(),
            text: bar_data.otu_labels.slice(0,10).reverse(),
            type: 'bar',
            orientation: 'h'
        };

        let bar = [trace1];
        
        Plotly.newPlot('bar', bar)
    });
};

function bubbleChart(sample) {

    d3.json(url).then((data) => {

        let sampleData = data.samples;

        let value = sampleData.filter(result => result.id == sample);

        let valueData = value[0];

        let trace2 = {
            x: valueData.otu_ids,
            y: valueData.sample_values,
            text: valueData.otu_labels,
            mode: 'markers',
            marker: {
                size: valueData.sample_values,
                color: valueData.otu_ids,
                colorscale: 'Earth'
            }
        };

        let bubble = [trace2];

        let layout = {
            xaxis: {title: 'OTU_ID'},
        };


        Plotly.newPlot('bubble', bubble, layout);
    });
};

function demoInfo(sample) {

    d3.json(url).then((data) => {

        let metadata = data.metadata;

        let value = metadata.filter((result) => result.id == sample);

        console.log(value)

        let valueData = value[0];

        d3.select("#sample-metadata").html("");

        Object.entries(valueData).forEach(([key,value]) => {

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

function optionChanged(newSample) {
    barChart(newSample);
    bubbleChart(newSample);
    demoInfo(newSample);
};

init();
