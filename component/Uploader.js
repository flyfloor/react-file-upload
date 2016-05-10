const React = require('react')

const xhr = require('./xhr')

const Uploader = React.createClass({
    propTypes: {
        multiple: React.PropTypes.bool,
        url: React.PropTypes.string.isRequired,
    },

    getInitialState() {
        return {
            list: [],
        };
    },

    getDefaultProps() {
        return {
            multiple: false,
            accept: "image/jpg,image/jpeg,image/gif,image/png,image/bmp,",
        };
    },

    handleFileChange(e){
        this.getFiles(e.target.files, this.handleUpload);
    },

    getFiles(files, uploadHander){
        for (let i = 0; i < files.length; i++) {
            uploadHander(files[i]);
        }
    },

    handleUpload(file){
        let {url} = this.props
        xhr({
            url,
            file,
            onSuccess(data) {
                console.log(data)
            },
            onProgress(loaded, total){
                console.log(loaded, total)
            }
        })
    },

    render() {
        const {multiple, accept} = this.props;
        let displayNodes = this.state.list.map((url, index) => {
            return (
                <li className="_item" key={`img_${index}`}>
                    <img src={url}/>
                </li>
            );
        })
        return (
            <div>
                <input type="file" multiple={multiple} accept={accept} onChange={this.handleFileChange}/>
                <ul className="_list">
                    {displayNodes}
                </ul>
            </div>
        );
    }
});

module.exports = Uploader;
