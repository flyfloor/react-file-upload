import React, { Component } from 'react';
import uploadCss from './upload.less';
import Css from './demo.less';
import ReactDOM from 'react-dom';
import Uploader from '../component/Uploader';

export class UploaderDemo extends Component {
    render() {
        return (
            <div className="container">
                <h2>React file uploader</h2>
                <ul>
                    <li>
                        <h3>Default uploader</h3>
                        <Uploader url='/upload' checkType={true}/>
                    </li>
                    <li>
                        <h3>Uploader support multiple file</h3>
                        <Uploader  url='/upload' multiple={true}/>
                    </li>
                    <li>
                        <h3>Uploader mode</h3>
                        <Uploader  url='/upload' mode={'card'}/>
                        <h4>simple</h4>
                        <Uploader  url='/upload' mode={'simple'}/>
                    </li>
                    <li>
                        <h3>Drag and drop uploader</h3>
                    </li>
                </ul>
            </div>
        );
    }
}


ReactDOM.render(<UploaderDemo/>, document.getElementById('root'))