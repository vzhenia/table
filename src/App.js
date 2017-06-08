import React, { Component } from 'react';
import './App.css';

//creating airtable
import Airtable from 'airtable';
let base = new Airtable({apiKey: 'key4HmsyoHOgXYZVD'}).base('appqtqafTUSHyl5rt');


// React component
// 1) Retrieves data from Airtable 'message' column
// 2) Posts message to Airtable 'attributeColumn' column
// 3) Displays confirmation message that message is posted to 'attributeColumn'
class App extends Component {

  state = {
      message: '',
      txtArr: [],
      refreshed: false
    }

  // When component mounts, it creates access to Airtable with api
  componentWillMount(){
    base('Table 1').find('recS5PfLTwafIL6Fq', (err, record) => {
        if (err) { console.error(err); return; }
        this.setState({message: record.fields.message})
      });
  }

  // This func is called onClick
  // 1) Retrieves text from Airtable 'message' column
  // 2) Parses text to extract each statement of the list recursively
  // 3) Puts statements in alphabetical order
  // 4) Updates component state so that the statements will be displayed
  createTxt = () => {
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
    txtArr = txtArr.sort((a,b) => {
      let aa = a.replace(' ', '')
      let bb = b.replace(' ', '')
      return aa[0] > bb[0]
    });

    this.setState({txtArr});
  }

  // This func is called onClick
  // 1) Posts updated text to Airtable 'attributeColumn'
  // 2) Updates component state to display confirmation message when success
  createTxtForAttrCol = (e, txtArr) => {
    e.preventDefault();
    const attributeColumnTxt = txtArr.join('; ');

    base('Table 1').update('recS5PfLTwafIL6Fq', {
          "attributeColumn": attributeColumnTxt
        }, (err, record) => {
            if (err) { console.error(err); return; }
            else { this.setState({refreshed: true}) }
    });
  }

  render() {
    const txtArr = this.state.txtArr;
    return (
      <div className="App">
        <div className="App-header">
          <h2>Airtable Refresh Task</h2>
        </div>

        <h2 style={{cursor: 'pointer'}}
          onClick={this.createTxt}>
          I think I'd be most useful in:
        </h2>
        {txtArr.length > 0 &&
          <ul style={{width: '50%', margin: '0 auto'}}>
            {txtArr.map((t,i) =>
              <li key={`k-${i}`}
                style={{textAlign: 'left'}}
                >
                {t}
              </li>)}
          </ul>}
        <button
          style={{height: 30, margin: '20px auto', fontSize: 14, cursor: 'pointer'}}
          onClick={(e) => this.createTxtForAttrCol(e, txtArr)}>
          Refresh attributeColumn
        </button>
        <h4 style={{display: this.state.refreshed ? 'block' : 'none', color: 'green'}}>
          attributeColumn refreshed!
        </h4>
      </div>
    );
  }
}

export default App;
