import './timeline_kraus.css';

import series from './data/series.json';
import categories from './data/categories.json';

import Vue from 'vue';

import Highcharts from "highcharts";
import Gantt from "highcharts/modules/gantt";
import HighchartsVue from "highcharts-vue";

Gantt(Highcharts);
Vue.use(HighchartsVue);

Highcharts.setOptions({
  lang: {
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
  }
})


export default {
  title: 'Example/GanttTimeline',
  //component: Highcharts,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/vue/configure/story-layout
    layout: 'fullscreen',
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: '<highcharts :key="\'c1\'"  :options="chartOptions" :constructor-type="type" :callback="chartCallback"/>'
});


// More on interaction testing: https://storybook.js.org/docs/vue/writing-tests/interaction-testing
export const GanttTimeline = Template.bind({});

const startDate = new Date(series[0].data.slice().sort((a, b) => a.start - b.start)[0].start);
const endDate = new Date(series[0].data.slice().sort((a, b) => b.end - a.end)[0].end);


GanttTimeline.args = {
  type: 'ganttChart',
  chartOptions: {
    chart: {
      inverted: true,

    },
    tooltip: {
      dateTimeLabelFormats: {
        day: '%A, %e. %B %Y',
      },
      useHTML: true,
      headerFormat: '<div>',
      pointFormat: '<span style="font-weight:bold">{point.name}</span><br/>' +
        '<span>{point.start:%A, %e. %B %Y}</span><br/>' +
        '<span>{point.end:%A, %e. %B %Y}</span><br/>' +
        '<span>{point.docs_count} Dokumente</span><br/>',
      footerFormat: '</div>',
    },
    title: {
      text: "Zeitstrahl",
    },
    yAxis: {
      labels: {
        enabled: false
      },
      categories: categories,
      gridLineWidth: 0,
    },
    xAxis: [{
      tickColor: '#fff',
      gridLineWidth: 2,
      gridLineColor: '#fff',
      opposite: false,
      labels: {
        format: "{value:%m/%Y}",
        style: {
          fontSize: "11px"
        }
      },
      tickInterval: 1000 * 60 * 60 * 24 * 30,
      min: Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth() - 1,
        startDate.getDay()
      ),
      max: Date.UTC(
        endDate.getFullYear(),
        endDate.getMonth() + 1,
        endDate.getDay()
      ),
    }],
    series: series
  }
  ,
  chartCallback(chart) {
    console.log(startDate, endDate)
    let chartWidth = 30 * chart.series[0].data.length / 8;
    let chartHeight = 15 * (
      endDate.getMonth() -
      startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear()))
    console.log(chartWidth)
    chart.update({
      chart: {
        width: chartWidth,
        height: chartHeight,
      }
    })
  }
}
