'use strict';

var React = require('react');

var xhr = require('./xhr');

var Uploader = React.createClass({
    displayName: 'Uploader',

    propTypes: {
        multiple: React.PropTypes.bool,
        url: React.PropTypes.string.isRequired
    },

    getInitialState: function getInitialState() {
        return {
            list: []
        };
    },
    getDefaultProps: function getDefaultProps() {
        return {
            multiple: false,
            accept: "image/jpg,image/jpeg,image/gif,image/png,image/bmp,"
        };
    },
    handleFileChange: function handleFileChange(e) {
        this.getFiles(e.target.files, this.handleUpload);
    },
    getFiles: function getFiles(files, uploadHander) {
        for (var i = 0; i < files.length; i++) {
            uploadHander(files[i]);
        }
    },
    handleUpload: function handleUpload(file) {
        var url = this.props.url;

        xhr({
            url: url,
            file: file,
            onSuccess: function onSuccess(data) {
                console.log(data);
            },
            onProgress: function onProgress(loaded, total) {
                console.log(loaded, total);
            }
        });
    },
    render: function render() {
        var _props = this.props;
        var multiple = _props.multiple;
        var accept = _props.accept;

        var displayNodes = this.state.list.map(function (url, index) {
            return React.createElement(
                'li',
                { className: '_item', key: 'img_' + index },
                React.createElement('img', { src: url })
            );
        });
        return React.createElement(
            'div',
            null,
            React.createElement('input', { type: 'file', multiple: multiple, accept: accept, onChange: this.handleFileChange }),
            React.createElement(
                'ul',
                { className: '_list' },
                displayNodes
            )
        );
    }
});

module.exports = Uploader;