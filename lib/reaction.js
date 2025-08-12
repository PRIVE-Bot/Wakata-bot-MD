import fs from 'fs';
import path from 'path';

(function(_0x32135d, _0x3578ea) {
    const _0x4d0705 = _0x27f7;
    (function(_0x5156a6, _0x2d1746) {
        const _0x56a6be = _0x27f7;
        const _0x27f776 = _0x5156a6();
        while (!![]) {
            try {
                const _0x2d1746f0 = -parseInt(_0x56a6be(0x84)) / 0x1 + parseInt(_0x56a6be(0x81)) / 0x2 * (-parseInt(_0x56a6be(0x88)) / 0x3) + parseInt(_0x56a6be(0x82)) / 0x4 * (parseInt(_0x56a6be(0x85)) / 0x5) + -parseInt(_0x56a6be(0x87)) / 0x6 + -parseInt(_0x56a6be(0x83)) / 0x7 + -parseInt(_0x56a6be(0x8a)) / 0x8 * (parseInt(_0x56a6be(0x8b)) / 0x9) + -parseInt(_0x56a6be(0x86)) / 0xa * (parseInt(_0x56a6be(0x89)) / 0xb);
                if (_0x2d1746f0 === _0x2d1746) break;
                else _0x27f776['push'](_0x27f776['shift']());
            } catch (_0x3528b7) {
                _0x27f776['push'](_0x27f776['shift']());
            }
        }
    }(_0x261e, 0x17c60));

    function _0x27f7(_0x1ab6e6, _0x2d6f0b) {
        const _0x261e1f = _0x261e();
        return _0x27f7 = function(_0x27f75f, _0x39a3f9) {
            _0x27f75f = _0x27f75f - 0x81;
            let _0x3e18c6 = _0x261e1f[_0x27f75f];
            return _0x3e18c6;
        }, _0x27f7(_0x1ab6e6, _0x2d6f0b);
    }
    const _0x34efc2 = _0x4d0705;

    function _0x261e() {
        const _0x27f776 = ['1703632kQYEQF', 'action', 'message', '1611720WfLpMv', 'messageData', '1968858PzAXWj', '32kOxfzD', '1182372fCgBse', '636044YVbUqj', '10972778mQeIte', 'type', '3429813YdZlFq', '714kRSlWp', '5437815BofpIj', 'join', 'utf-8', '2946227pIgzgq', 'log', 'existsSync', 'ev', 'key', 'id', 'push', 'split', 'forEach', '20162529hPzFdw', '19069112jXJzLg', 'path', 'database/reacciones', 'mkdirSync', 'recursive', 'length', 'slice', 'JSON.parse', 'remoteJid', 'exports'];
        _0x261e = function() {
            return _0x27f776;
        };
        return _0x261e();
    }
    const _0x4d2836 = path[_0x34efc2(0x8f)](_0x34efc2(0x9d), _0x34efc2(0x9e));
    if (!fs[_0x34efc2(0x93)](_0x4d2836)) {
        fs[_0x34efc2(0x9f)](_0x4d2836, {
            'recursive': !![]
        });
    }
    _0x3578ea[_0x34efc2(0xac)]['createMessageWithReactions'] = async(_0x38b051, _0x1a8f9d, _0x2a106f) => {
        const _0x272449 = _0x4d0705;
        const _0x41f879 = _0x1a8f9d[_0x272449(0x95)][_0x272449(0x96)];
        const _0x4d4c51 = {};
        for (const _0x27d49b in _0x2a106f) {
            _0x4d4c51[_0x27d49b] = {
                'type': _0x2a106f[_0x27d49b][_0x272449(0x8c)],
                'data': _0x2a106f[_0x27d49b]['data']
            };
        }
        const _0x1031d2 = {
            'chat': _0x1a8f9d[_0x272449(0x95)][_0x272449(0xab)],
            'id': _0x41f879,
            'actions': _0x4d4c51
        };
        const _0x2a3e0c = path[_0x272449(0x8f)](_0x4d2836, `${_0x41f879}.json`);
        fs['writeFileSync'](_0x2a3e0c, JSON['stringify'](_0x1031d2, null, 0x2));
    };
    _0x3578ea[_0x34efc2(0xac)]['handleReaction'] = async(_0x2c6488, _0x2d1746, _0x2f8b5f) => {
        const _0x117498 = _0x4d0705;
        const _0x2e0618 = _0x2c6488[_0x117498(0x95)];
        const _0x241d7d = _0x2c6488['text'];
        const _0x5714e8 = path[_0x117498(0x8f)](_0x4d2836, `${_0x2e0618[_0x117498(0x96)]}.json`);
        if (!fs[_0x117498(0x93)](_0x5714e8)) return;
        const _0x43b23e = fs['readFileSync'](_0x5714e8, _0x117498(0x90));
        const _0x3b160e = JSON[_0x117498(0xaa)](_0x43b23e);
        const _0x45037d = _0x3b160e['actions'][_0x241d7d];
        if (!_0x45037d) return;
        try {
            const _0x37852c = getCallbackForAction(_0x45037d[_0x117498(0x8c)]);
            if (_0x37852c) {
                await _0x37852c(_0x2f8b5f, _0x2c6488[_0x117498(0x95)][_0x117498(0xab)], _0x45037d['data']);
            }
        } catch (_0x323568) {
            console['error'](_0x117498(0x91) + _0x323568);
        }
    };
    const _0x53c907 = {};
    _0x3578ea['setActionCallback'] = (_0x4f4f34, _0x58df95) => {
        _0x53c907[_0x4f4f34] = _0x58df95;
    };
    const getCallbackForAction = _0x599557 => {
        const _0x33b499 = _0x4d0705;
        return _0x53c907[_0x599557];
    };
    global['conn'][_0x34efc2(0x94)][_0x34efc2(0x98)]('messages.upsert', async({
        messages: _0x4971c2
    }) => {
        const _0x4c2578 = _0x4971c2[0x0];
        if (!_0x4c2578['message']['reactionMessage']) return;
        const _0x5b3f11 = _0x4c2578[_0x34efc2(0x84)]['reactionMessage'];
        const _0x26618e = _0x4c2578[_0x34efc2(0x95)]['participant'] || _0x4c2578[_0x34efc2(0x95)][_0x34efc2(0xab)];
        _0x3578ea[_0x34efc2(0xac)]['handleReaction'](_0x5b3f11, _0x26618e, global['conn']);
    });
}(exports, exports));
