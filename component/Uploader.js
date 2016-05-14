const React = require('react')
const xhr = require('./xhr')

const formatSize = (byte = 0) => {
    byte = parseInt(byte)
    if (byte / 1000000 > 1) {
        return `${(parseInt(byte) / 1000000).toFixed(2)}m`
    }
    return `${(parseInt(byte) / 1000).toFixed(2)}k`
}

const Uploader = React.createClass({
    propTypes: {
        multiple: React.PropTypes.bool,
        checkType: React.PropTypes.bool,
        showDistroy: React.PropTypes.bool,
        destroyIcon: React.PropTypes.element,
        url: React.PropTypes.string.isRequired,
        mode: React.PropTypes.oneOf(['simple', 'list', 'card']),
    },

    getInitialState() {
        return {
            queue: [],
        };
    },

    getDefaultProps() {
        return {
            multiple: false,
            mode: 'list',
            accept: "image/jpg,image/jpeg,image/gif,image/png,image/bmp,",
            checkType: false,
            showDistroy: true,
            destroyIcon: <div>x</div>,
        };
    },

    handleFileChange(e){
        this.handleFiles(e.target.files, this.handleUpload);
    },

    handleFiles(files, uploadFunc){
        let {queue} = this.state
        files = this.formatFiles(files)
        this.setState({ 
            queue: queue.concat(files)
        })

        Array.prototype.map.call(files, file => {
            ((file) => {
                file = this.initFileObj(file)
                uploadFunc(file)
            })(file)
        })
    },

    formatFiles(files){
        let rtn = []
        let {accept, checkType} = this.props
        Array.prototype.map.call(files, (file) => {
            if (checkType && (!file.type || accept.indexOf(file.type) === -1)) {
                console.error('文件类型不支持')
                return
            }
            rtn.push(file)
        })
        return rtn
    },

    initFileObj(file){
        let reader = new FileReader()
        reader.onload = ((file) => {
            return (e) => file.image = e.target.result
        })(file)
        reader.readAsDataURL(file)

        if (file.completed === undefined) {
            file.completed = 0
        }
        return file
    },

    handleUpload(file) {
        let {url} = this.props
        let that = this
        xhr({
            url, file,
            onSuccess(data) {
                if (that.onSuccess) that.onSuccess(data)
            },
            onProgress(loaded, total){
                if (total) {
                    let {queue} = that.state
                    let index = queue.indexOf(file)
                    if (index !== -1) {
                        file.progress = loaded / total * 100
                        that.setState({ queue })
                    }
                }
            },
            onError(error){
                let {queue} = that.state
                let index = queue.indexOf(file)
                if (index !== -1) {
                    delete queue[index]
                    that.setState({ queue })
                }
                if (that.onError) that.onError(error)
                console.error(error)
            }
        })
    },

    handleDestroyItem(file){
        let {queue} = this.state
        let index = queue.indexOf(file)
        if (index !== -1) {
            delete queue[index]
            this.setState({
                queue
            });
        }
    },

    render() {
        const {multiple, accept, mode, showDistroy, destroyIcon} = this.props
        let {queue} = this.state
        let displayNodes = queue.map((file, index) => {
            let {progress, name, image, size} = file
            return (
                <li className={progress === 100 ? 'uploader-item completed' : 'uploader-item'} key={`img_${index}`}>
                    <div className="uploader-preview">
                        <img src={image}/>
                    </div>
                    {mode !== 'list'
                        ? <div className='uploader-progress'>
                                <div className="uploader-progress-bar" style={{'width': `${progress}%`}}></div>
                            </div>
                        : null }
                    <div className="uploader-content">
                        {mode === 'simple' 
                            ? null
                            : <div className="uploader-name">{name}</div> }
                        {mode === 'list'
                            ? <div className='uploader-progress'>
                                <div className="uploader-progress-bar" style={{'width': `${progress}%`}}></div>
                            </div>
                            : null
                        }
                        {mode === 'simple' 
                            ? null
                            : <div className="uploader-size">
                                <div>{formatSize(size)}</div>
                            </div> }
                        {showDistroy 
                            ? <div className="uploader-destroy" onClick={() => this.handleDestroyItem(file)}>
                                {destroyIcon}
                            </div>
                            : null}
                    </div>
                </li>
            )
        })

        return (
            <div className='uploader'>
                <label className="uploader-label">
                    选择文件
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

module.exports = Uploader;
