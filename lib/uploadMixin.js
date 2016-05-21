'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _xhr = require('./xhr');

var _xhr2 = _interopRequireDefault(_xhr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uploadMixin = {
    propTypes: {
        multiple: _react2.default.PropTypes.bool,
        checkType: _react2.default.PropTypes.bool,
        showDistroy: _react2.default.PropTypes.bool,
        destroyIcon: _react2.default.PropTypes.element,
        url: _react2.default.PropTypes.string.isRequired,
        label: _react2.default.PropTypes.element,
        maxHeight: _react2.default.PropTypes.number,
        maxWidth: _react2.default.PropTypes.number
    },
    getInitialState: function getInitialState() {
        return {
            queue: []
        };
    },
    getDefaultProps: function getDefaultProps() {
        return {
            multiple: false,
            accept: "image/jpg,image/jpeg,image/gif,image/png,image/bmp,",
            checkType: false,
            showDistroy: true,
            destroyIcon: _react2.default.createElement(
                'div',
                null,
                'x'
            ),
            maxHeight: 600,
            maxWidth: 800
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
    shrinkFileBySrc: function shrinkFileBySrc(file, src) {
        var _props2 = this.props;
        var maxWidth = _props2.maxWidth;
        var maxHeight = _props2.maxHeight;

        var img = new Image();
        img.onload = function () {
            var canvas = document.createElement('canvas');
            if (img.height > maxHeight) {
                img.width = maxHeight / img.height * img.width;
                img.height = maxHeight;
            }
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            file.preview = canvas.toDataURL('image/jpeg');
        };
        img.src = src;
    },
    initFileObj: function initFileObj(file) {
        var _this2 = this;

        var reader = new FileReader();
        reader.onload = function (file) {
            return function (e) {
                _this2.shrinkFileBySrc(file, e.target.result);
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
        var _that$props = that.props;
        var _onSuccess = _that$props.onSuccess;
        var _onError = _that$props.onError;

        (0, _xhr2.default)({
            url: url, file: file,
            onSuccess: function onSuccess(data) {
                if (_onSuccess) _onSuccess(data);
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

                if (index !== -1) {
                    queue.splice(index, 1);
                    that.setState({
                        queue: queue
                    });
                }
                if (_onError) _onError(error);
                console.error(error);
            }
        });
    },
    handleDestroyItem: function handleDestroyItem(file) {
        var queue = this.state.queue;

        var index = queue.indexOf(file);
        if (index !== -1) {
            queue.splice(index, 1);
            this.setState({
                queue: queue
            });
        }
    }
};

exports.default = uploadMixin;