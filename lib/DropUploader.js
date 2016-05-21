'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _uploadMixin = require('./uploadMixin');

var _uploadMixin2 = _interopRequireDefault(_uploadMixin);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DropUploader = _react2.default.createClass({
    displayName: 'DropUploader',
    getDefaultProps: function getDefaultProps() {
        return {
            label: _react2.default.createElement(
                'span',
                null,
                '选择文件 ',
                _react2.default.createElement(
                    'span',
                    null,
                    '或者拖拽文件至此'
                )
            )
        };
    },

    mixins: [_uploadMixin2.default],
    handleDrop: function handleDrop(e) {
        e.preventDefault();
        var dataTransfer = e.dataTransfer || e.originalEvent.dataTransfer;
        var files = dataTransfer.files;

        if (files) {
            this.handleFiles(files, this.handleUpload);
        }
    },
    render: function render() {
        var _this = this;

        var _props = this.props;
        var multiple = _props.multiple;
        var accept = _props.accept;
        var children = _props.children;
        var label = _props.label;
        var showDistroy = _props.showDistroy;
        var destroyIcon = _props.destroyIcon;
        var queue = this.state.queue;

        var queueNode = queue.map(function (file, index) {
            var progress = file.progress;
            var name = file.name;
            var preview = file.preview;
            var size = file.size;

            return _react2.default.createElement(
                'li',
                { className: progress === 100 ? 'uploader-item completed' : 'uploader-item', key: 'img_' + index },
                _react2.default.createElement(
                    'div',
                    { className: 'uploader-preview' },
                    _react2.default.createElement('img', { src: preview })
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'uploader-progress' },
                    _react2.default.createElement('div', { className: 'uploader-progress-bar', style: { 'width': progress + '%' } })
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'uploader-content' },
                    _react2.default.createElement(
                        'div',
                        { className: 'uploader-name' },
                        name
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'uploader-size' },
                        _react2.default.createElement(
                            'div',
                            null,
                            (0, _util.formatSize)(size)
                        )
                    ),
                    showDistroy ? _react2.default.createElement(
                        'div',
                        { className: 'uploader-destroy', onClick: function onClick() {
                                return _this.handleDestroyItem(file);
                            } },
                        destroyIcon
                    ) : null
                )
            );
        });

        var fileNode = _react2.default.createElement('input', { type: 'file', className: 'uploader-input',
            multiple: multiple, accept: accept,
            onChange: this.handleFileChange });

        var labelNode = null;
        if (children) {
            labelNode = queue.length === 0 ? _react2.default.createElement(
                'label',
                { style: { 'position': 'relative', 'cursor': 'pointer' } },
                children,
                fileNode
            ) : fileNode;
        } else {
            labelNode = queue.length === 0 ? _react2.default.createElement(
                'label',
                { className: 'uploader-label' },
                label,
                fileNode
            ) : fileNode;
        }

        return _react2.default.createElement(
            'div',
            { className: 'drop-uploader', onDrop: this.handleDrop, onDragOver: function onDragOver(e) {
                    return e.preventDefault();
                } },
            labelNode,
            _react2.default.createElement(
                'ul',
                { className: 'uploader-queue' },
                queueNode
            )
        );
    }
});

exports.default = DropUploader;