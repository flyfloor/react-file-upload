const React = require('react')
const uploadMixin = require('./uploadMixin')
const {formatSize} = require('./util')

const Uploader = React.createClass({
    mixins: [uploadMixin],
    propTypes: {
        mode: React.PropTypes.oneOf(['simple', 'list', 'card']),
    },

    getDefaultProps() {
        return {
            mode: 'list',
            label: <span>上传文件</span>,
        };
    },

    render() {
        const {multiple, label, accept, mode, showDistroy, destroyIcon} = this.props
        let {queue} = this.state
        let displayNodes = queue.map((file, index) => {
            let {progress, name, preview, size} = file
            return (
                <li className={progress === 100 ? 'uploader-item completed' : 'uploader-item'} key={`img_${index}`}>
                    <div className="uploader-preview">
                        <img src={preview}/>
                    </div>
                    {mode !== 'list'
                        ? <div className='uploader-progress'>
                                <div className="uploader-progress-bar" style={{'width': `${progress}%`}}></div>
                            </div>
                        : null }
                    {mode === 'simple' 
                        ? null 
                        : <div className="uploader-content">
                            <div className="uploader-name">{name}</div>
                            {mode === 'list'
                                ? <div className='uploader-progress'>
                                    <div className="uploader-progress-bar" style={{'width': `${progress}%`}}></div>
                                </div>
                                : null
                            }
                            <div className="uploader-size">
                                <div>{formatSize(size)}</div>
                            </div>
                            {showDistroy 
                                ? <div className="uploader-destroy" onClick={() => this.handleDestroyItem(file)}>
                                    {destroyIcon}
                                </div>
                                : null}
                        </div> }
                </li>
            )
        })

        return (
            <div className='uploader'>
                <label className="uploader-label">
                    {label}
                    <input type="file" className="uploader-input" 
                    multiple={multiple} accept={accept} onChange={this.handleFileChange}/>
                </label>
                <ul className={`uploader-queue ${mode}`}>
                    {displayNodes}
                </ul>
            </div>
        );
    }
});

module.exports = Uploader
