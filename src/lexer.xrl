Definitions.
N = [0-9]
F = {N}+\.{N}+
U = [A-Za-z]
R = (break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|function|if|import|in|instanceof|let|new|null|return|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)

Rules.
\r|\t|\\  : skip_token.

% --------- Separadores y agrupadores ---------
\n|\s : {token, {space, TokenLine, TokenChars}}.
\(|\)|\[|\]|\{|\} : {token, {grouping, TokenLine, TokenChars}}.
[;,] : {token, {separate, TokenLine, TokenChars}}.

% --------- Los números en decimal y sus diferentes formas de representarlos ---------
{N}+ : {token, {int, TokenLine, list_to_integer(TokenChars)}}.
{N}+n : {token, {bigInt, TokenLine, TokenChars}}.
([1-9]+_{N}+)+n? : {token, {intUnderS, TokenLine, TokenChars}}.
{F} : {token, {float, TokenLine, TokenChars}}.
({N}+|{F})(e|E)\-?{N}+ : {token, {exponential, TokenLine, TokenChars}}.

% --------- Los números en binario, octal y decimal ---------
((0[b|B][01]+)|(0[b|B]([01]+_[01]+)+))n? : {token, {binary, TokenLine, TokenChars}}.
((0[o|O][0-7]+)|(0[o|O]([0-7]+_[0-7]+)+))n? : {token, {octal, TokenLine, TokenChars}}.
((0[x|X][0-9A-Fa-f]+)|(0[x|X]([0-9A-Fa-f]+_[0-9A-Fa-f]+)+))n? : {token, {hexadecimal, TokenLine, TokenChars}}.

% --------- Palabras reservadas e identificadores ---------
true|false : {token, {bool, TokenLine, TokenChars}}.
{R} : {token, {reservedWord, TokenLine, TokenChars}}.
({U}|\$|_)({U}|{N}|\$|_)* : {token, {identifier, TokenLine, TokenChars}}.

% --------- Cadenas de caracteres (strings) ---------
(\"[^"]*\")|('[^']*')|(\/(.|(\\/))*\/)|(\\'[^']*\\') : {token, {string, TokenLine, TokenChars}}.
% |(\/[^\/]\/)|(\\'[^']\\')
`[^`]*` : {token, {string, TokenLine, TokenChars}}.

% --------- Operadores matemáticos, lógicos y demás ---------
\+|\-|\*|\/|=|\+\+|\-\-|\+=|\-=|/=|\*=|\:|\.|\%|\*\*|#|@  : {token, {operator, TokenLine, TokenChars}}.
==|===|!=|!===|<|>|<=|>=|&&|\|\||!|\? : {token, {logicOperator, TokenLine, TokenChars}}.
\&|\||~|\^|<<|>>|>>>|[\\]+ : {token, {bitwiseOperator, TokenLine, TokenChars}}.
=> : {token, {arrowOperator, TokenLine, TokenChars}}.

% --------- Comentarios ---------
\/\/.*\n : {token, {comment1L, TokenLine, TokenChars}}.
\/\*([^\*]|[\r\n]|(\*+([^\*\/]|[\r\n])))*\*\/ : {token, {commentML, TokenLine, TokenChars}}.
#!.*\n : {token, {commentHash, TokenLine, TokenChars}}.

Erlang code.