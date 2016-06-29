const React = require('react')
const xhr = require('./xhr')

const uploadMixin = {
    propTypes: {
        multiple: React.PropTypes.bool,
        checkType: React.PropTypes.bool,
        showDistroy: React.PropTypes.bool,
        destroyIcon: React.PropTypes.element,
        url: React.PropTypes.string.isRequired,
        label: React.PropTypes.element,
        maxHeight: React.PropTypes.number,
        maxWidth: React.PropTypes.number,
    },
    getInitialState() {
        return {
            queue: [],
        };
    },
    getDefaultProps() {
        return {
            multiple: false,
            accept: "image/jpg,image/jpeg,image/gif,image/png,image/bmp,",
            checkType: false,
            showDistroy: true,
            destroyIcon: <div>x</div>,
            maxHeight: 600,
            maxWidth: 800,
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

    shrinkFileBySrc(file, src){
        let {maxWidth, maxHeight} = this.props
        let img = new Image()
        img.onload = () => {
            let canvas = document.createElement('canvas')
            if (img.height > maxHeight) {
                img.width =  maxHeight / img.height * img.width
                img.height = maxHeight
            }
            let ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0, img.width, img.height)
            file.preview = canvas.toDataURL('image/jpeg')
        }
        img.src = src
    },

    initFileObj(file){
        let reader = new FileReader()
        reader.onload = ((file) => {
            return (e) => {
                this.shrinkFileBySrc(file, e.target.result)
            }
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
        let {onSuccess, onError} = that.props
        xhr({
            url, file,
            onSuccess(data) {
                if (onSuccess) onSuccess(data)
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
                    queue.splice(index, 1)
                    that.setState({
                        queue
                    });
                }
                if (onError) onError(error)
                console.error(error)
            }
        })
    },

    handleDestroyItem(file){
        let {queue} = this.state
        let index = queue.indexOf(file)
        if (index !== -1) {
            queue.splice(index, 1)
            this.setState({
                queue
            });
        }
    },
}

module.exports = uploadMixin