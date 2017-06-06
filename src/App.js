import React, { Component } from 'react';
import './App.css';
//import _ from 'lodash';

import Airtable from 'airtable';
let base = new Airtable({apiKey: 'key4HmsyoHOgXYZVD'}).base('appqtqafTUSHyl5rt');


class App extends Component {
  constructor(){
    super()
    this.state = {
      message: ''
    }
  }

  componentWillMount(){
    base('Table 1').find('recS5PfLTwafIL6Fq', (err, record) => {
        if (err) { console.error(err); return; }
        this.setState({message: record.fields.message})
      });
  }

  render() {
    let message = this.state.message;
    message = message.replace('I have less experience in, but would love to learn more:', '')
    let txtArr = [];
    const re = /[0-9]+\)/g;

    while (re.test(message)){

      let index = message.search(re);
      let messageBit = message.slice(index + 3);
      txtArr.push(messageBit.slice(0, messageBit.search(re)));

      message = messageBit;

    }
    txtArr = txtArr.sort((a,b) => {a[0] > b[0]});

    const attributeColumnTxt = txtArr.join('; ');

    base('Table 1').update('recS5PfLTwafIL6Fq', {
          "attributeColumn": attributeColumnTxt
        }, function(err, record) {
            if (err) { console.error(err); return; }
    });


    return (
      <div className="App">
        <div className="App-header">
          <h2>Session Task</h2>
        </div>
        <h2>I think I'd be most useful in:</h2>
        <ul style={{width: '50%', margin: '0 auto'}}>
          {txtArr.map((t,i) => <li key={`k-${i}`} style={{textAlign: 'left'}}>{t}</li>)}
        </ul>
      </div>
    );
  }
}

export default App;
