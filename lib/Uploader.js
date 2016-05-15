'use strict';

var React = require('react');
var xhr = require('./xhr');

var formatSize = function formatSize() {
    var byte = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

    byte = parseInt(byte);
    if (byte / 1000000 > 1) {
        return (parseInt(byte) / 1000000).toFixed(2) + 'm';
    }
    return (parseInt(byte) / 1000).toFixed(2) + 'k';
};

var Uploader = React.createClass({
    displayName: 'Uploader',

    propTypes: {
        multiple: React.PropTypes.bool,
        checkType: React.PropTypes.bool,
        showDistroy: React.PropTypes.bool,
        destroyIcon: React.PropTypes.element,
        url: React.PropTypes.string.isRequired,
        mode: React.PropTypes.oneOf(['simple', 'list', 'card'])
    },

    getInitialState: function getInitialState() {
        return {
            queue: []
        };
    },
    getDefaultProps: function getDefaultProps() {
        return {
            multiple: false,
            mode: 'list',
            accept: "image/jpg,image/jpeg,image/gif,image/png,image/bmp,",
            checkType: false,
            showDistroy: true,
            destroyIcon: React.createElement(
                'div',
                null,
                'x'
            )
        };
    },
    handleFileChange: function handleFileChange(e) {
        this.handleFiles(e.target.files, this.handleUpload);
    },
    handleFiles: function handleFiles(files, uploadFunc) {
        var _this = this;

        var queue = this.state.queue;

        files = this.formatFiles(files);
        this.setState({
            queue: queue.concat(files)
        });

        Array.prototype.map.call(files, function (file) {
            (function (file) {
                file = _this.initFileObj(file);
                uploadFunc(file);
            })(file);
        });
    },
    formatFiles: function formatFiles(files) {
        var rtn = [];
        var _props = this.props;
        var accept = _props.accept;
        var checkType = _props.checkType;

        Array.prototype.map.call(files, function (file) {
            if (checkType && (!file.type || accept.indexOf(file.type) === -1)) {
                console.error('文件类型不支持');
                return;
            }
            rtn.push(file);
        });
        return rtn;
    },
    initFileObj: function initFileObj(file) {
        var reader = new FileReader();
        reader.onload = function (file) {
            return function (e) {
                return file.image = e.target.result;
            };
        }(file);
        reader.readAsDataURL(file);

        if (file.completed === undefined) {
            file.completed = 0;
        }
        return file;
    },
    handleUpload: function handleUpload(file) {
        var url = this.props.url;

        var that = this;
        xhr({
            url: url, file: file,
            onSuccess: function onSuccess(data) {
                var onSuccess = that.props.onSuccess;

                if (onSuccess) onSuccess(data);
            },
            onProgress: function onProgress(loaded, total) {
                if (total) {
                    var queue = that.state.queue;

                    var index = queue.indexOf(file);
                    if (index !== -1) {
                        file.progress = loaded / total * 100;
                        that.setState({ queue: queue });
                    }
                }
            },
            onError: function onError(error) {
                var queue = that.state.queue;

                var index = queue.indexOf(file);
                var onError = that.props.onError;

                if (index !== -1) {
                    delete queue[index];
                    that.setState({ queue: queue });
                }
                if (onError) onError(error);
                console.error(error);
            }
        });
    },
    handleDestroyItem: function handleDestroyItem(file) {
        var queue = this.state.queue;

        var index = queue.indexOf(file);
        if (index !== -1) {
            delete queue[index];
            this.setState({
                queue: queue
            });
        }
    },
    render: function render() {
        var _this2 = this;

        var _props2 = this.props;
        var multiple = _props2.multiple;
        var accept = _props2.accept;
        var mode = _props2.mode;
        var showDistroy = _props2.showDistroy;
        var destroyIcon = _props2.destroyIcon;
        var queue = this.state.queue;

        var displayNodes = queue.map(function (file, index) {
            var progress = file.progress;
            var name = file.name;
            var image = file.image;
            var size = file.size;

            return React.createElement(
                'li',
                { className: progress === 100 ? 'uploader-item completed' : 'uploader-item', key: 'img_' + index },
                React.createElement(
                    'div',
                    { className: 'uploader-preview' },
                    React.createElement('img', { src: image })
                ),
                mode !== 'list' ? React.createElement(
                    'div',
                    { className: 'uploader-progress' },
                    React.createElement('div', { className: 'uploader-progress-bar', style: { 'width': progress + '%' } })
                ) : null,
                mode === 'simple' ? null : React.createElement(
                    'div',
                    { className: 'uploader-content' },
                    React.createElement(
                        'div',
                        { className: 'uploader-name' },
                        name
                    ),
                    mode === 'list' ? React.createElement(
                        'div',
                        { className: 'uploader-progress' },
                        React.createElement('div', { className: 'uploader-progress-bar', style: { 'width': progress + '%' } })
                    ) : null,
                    React.createElement(
                        'div',
                        { className: 'uploader-size' },
                        React.createElement(
                            'div',
                            null,
                            formatSize(size)
                        )
                    ),
                    showDistroy ? React.createElement(
                        'div',
                        { className: 'uploader-destroy', onClick: function onClick() {
                                return _this2.handleDestroyItem(file);
                            } },
                        destroyIcon
                    ) : null
                )
            );
        });

        return React.createElement(
            'div',
            { className: 'uploader' },
            React.createElement(
                'label',
                { className: 'uploader-label' },
                '选择文件',
                React.createElement('input', { type: 'file', className: 'uploader-input',
                    multiple: multiple, accept: accept, onChange: this.handleFileChange })
            ),
            React.createElement(
                'ul',
                { className: 'uploader-queue ' + mode },
                displayNodes
            )
        );
    }
});

module.exports = Uploader;