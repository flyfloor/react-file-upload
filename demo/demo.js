import React, { Component } from 'react';
import uploadCss from '../css/upload.less';
import Css from './demo.less';
import ReactDOM from 'react-dom';
import Uploader from '../component/Uploader';
import DropUploader from '../component/DropUploader';

export class UploaderDemo extends Component {
    handleSuccess(data){
        console.log(data)
    }
    handleError(err){
        console.log('error:', err)
    }
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
                        <Uploader  url='/upload' multiple={true} 
                            onError={this.handleError.bind(this)} 
                            onSuccess={this.handleSuccess.bind(this)} label={<p>选择文件</p>}/>
                    </li>
                    <li>
                        <h3>Uploader mode</h3>
                        <Uploader  url='/upload' mode={'card'}/>
                        <h4>simple</h4>
                        <Uploader  url='/upload' mode={'simple'}/>
                    </li>
                    <li>
                        <h3>Drag and drop uploader</h3>
                        <DropUploader url='/upload'/>
                    </li>
                    <li>
                        <h3>Customize drop content</h3>
                        <DropUploader url='/upload'>
                            <div style={{'textAlign': 'center'}}>
                                <h3>This is the content</h3>
                                <p>png only</p>
                                <p>size limit</p>
                                <p>just a simple uploader</p>
                            </div>
                        </DropUploader>
                    </li>
                </ul>
            </div>
        );
    }
}


ReactDOM.render(<UploaderDemo/>, document.getElementById('root'))