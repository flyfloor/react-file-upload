const React = require('react')
const uploadMixin = require('./uploadMixin')
const {formatSize} = require('./util')

const DropUploader = React.createClass({
    getDefaultProps() {
        return {
            label: <span>选择文件 <span>或者拖拽文件至此</span></span>
        }
    },
    mixins: [uploadMixin],
    handleDrop(e){
        e.preventDefault();
        let dataTransfer = e.dataTransfer || e.originalEvent.dataTransfer
        let {files} = dataTransfer
        if (files) {
            this.handleFiles(files, this.handleUpload)
        }
    },

    render() {
        const {multiple, accept, children, label, showDistroy, destroyIcon} = this.props
        let {queue} = this.state
        let queueNode = queue.map((file, index) => {
            let {progress, name, preview, size} = file
            return (
                <li className={progress === 100 ? 'uploader-item completed' : 'uploader-item'} key={`img_${index}`}>
                    <div className="uploader-preview">
                        <img src={preview}/>
                    </div>
                    <div className='uploader-progress'>
                        <div className="uploader-progress-bar" style={{'width': `${progress}%`}}></div>
                    </div>
                    <div className="uploader-content">
                        <div className="uploader-name">{name}</div>
                        <div className="uploader-size">
                            <div>{formatSize(size)}</div>
                        </div>
                        {showDistroy 
                            ? <div className="uploader-destroy" onClick={() => this.handleDestroyItem(file)}>
                                {destroyIcon}
                            </div>
                            : null}
                    </div>
                </li>
            )
        })

        let fileNode = <input type="file" className="uploader-input" 
                            multiple={multiple} accept={accept} 
                            onChange={this.handleFileChange}/>

        let labelNode = null;
        if (children) {
            labelNode = queue.length === 0 
                        ? <label style={{'position': 'relative', 'cursor': 'pointer'}}>
                            {children}
                            {fileNode}
                        </label>
                        : fileNode
        } else {
            labelNode = queue.length === 0 
                        ? <label className="uploader-label">
                                {label}
                                {fileNode}
                            </label>
                        : fileNode
        }

        return (
            <div className="drop-uploader" onDrop={this.handleDrop} onDragOver={(e) => e.preventDefault()}>
                {labelNode}
                <ul className='uploader-queue'>
                    {queueNode}
                </ul>
            </div>
        );
    }
});

module.exports = DropUploader
