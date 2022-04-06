const fs = require('fs');
const pdf = require('pdf-parse');
module.exports = function (RED) {
    function FunctionNode(n) {
        RED.nodes.createNode(this, n);

        var node = this;
        this.name = n.name;
        for (var key in n) {
            node[key] = n[key] || "";
        }

        this.on('input', function (msg) {
            for (var i in msg) {
                if (i !== 'req' | i !== 'res' | i !== 'payload' | i !== 'send' | i !== '_msgid') {
                    node[i] =  msg[i] || node[i];
                }
            }
            try{
                let dataBuffer = fs.readFileSync(node.path);

                pdf(dataBuffer).then(function(data) {
                    msg.payload = data;
                    node.send(msg);
                });

            }catch (e){
                node.error(e);
            }
        });
    }
    RED.nodes.registerType("pdfparse", FunctionNode, {});
};

