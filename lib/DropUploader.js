'use strict';

var React = require('react');
var uploadMixin = require('./uploadMixin');

var _require = require('./util');

var formatSize = _require.formatSize;


var DropUploader = React.createClass({
    displayName: 'DropUploader',
    getDefaultProps: function getDefaultProps() {
        return {
            label: React.createElement(
                'span',
                null,
                '选择文件 ',
                React.createElement(
                    'span',
                    null,
                    '或者拖拽文件至此'
                )
            )
        };
    },

    mixins: [uploadMixin],
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

            return React.createElement(
                'li',
                { className: progress === 100 ? 'uploader-item completed' : 'uploader-item', key: 'img_' + index },
                React.createElement(
                    'div',
                    { className: 'uploader-preview' },
                    React.createElement('img', { src: preview })
                ),
                React.createElement(
                    'div',
                    { className: 'uploader-progress' },
                    React.createElement('div', { className: 'uploader-progress-bar', style: { 'width': progress + '%' } })
                ),
                React.createElement(
                    'div',
                    { className: 'uploader-content' },
                    React.createElement(
                        'div',
                        { className: 'uploader-name' },
                        name
                    ),
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
                                return _this.handleDestroyItem(file);
                            } },
                        destroyIcon
                    ) : null
                )
            );
        });

        var fileNode = React.createElement('input', { type: 'file', className: 'uploader-input',
            multiple: multiple, accept: accept,
            onChange: this.handleFileChange });

        var labelNode = null;
        if (children) {
            labelNode = queue.length === 0 ? React.createElement(
                'label',
                { style: { 'position': 'relative', 'cursor': 'pointer' } },
                children,
                fileNode
            ) : fileNode;
        } else {
            labelNode = queue.length === 0 ? React.createElement(
                'label',
                { className: 'uploader-label' },
                label,
                fileNode
            ) : fileNode;
        }

        return React.createElement(
            'div',
            { className: 'drop-uploader', onDrop: this.handleDrop, onDragOver: function onDragOver(e) {
                    return e.preventDefault();
                } },
            labelNode,
            React.createElement(
                'ul',
                { className: 'uploader-queue' },
                queueNode
            )
        );
    }
});

module.exports = DropUploader;