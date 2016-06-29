'use strict';

var React = require('react');
var uploadMixin = require('./uploadMixin');

var _require = require('./util');

var formatSize = _require.formatSize;


var Uploader = React.createClass({
    displayName: 'Uploader',

    mixins: [uploadMixin],
    propTypes: {
        mode: React.PropTypes.oneOf(['simple', 'list', 'card'])
    },

    getDefaultProps: function getDefaultProps() {
        return {
            mode: 'list',
            label: React.createElement(
                'span',
                null,
                '上传文件'
            )
        };
    },
    render: function render() {
        var _this = this;

        var _props = this.props;
        var multiple = _props.multiple;
        var label = _props.label;
        var accept = _props.accept;
        var mode = _props.mode;
        var showDistroy = _props.showDistroy;
        var destroyIcon = _props.destroyIcon;
        var queue = this.state.queue;

        var displayNodes = queue.map(function (file, index) {
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
                                return _this.handleDestroyItem(file);
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
                label,
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