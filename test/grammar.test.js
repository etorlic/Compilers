import assert from "assert"
import ast from "../src/ast.js"

// Programs expected to be syntactically correct
const syntaxChecks = [
  ["a simple string literal", 'retweet:"Hello, World!":;;'],
  ["variable declarations", "int x == 5;; \nboolin x == based;;"],
  ["function with one param", "flossin boolin exampleFunction: {}"],
  ["if", "vibeCheck :x=5: {}"],
  ["else", "vibeCheck :x=5: {} badVibes {}"],
  ["elseif", "vibeCheck :x=5: {}recount :x=6:{} badVibes {}"],
  ["function with no params, no return type", "flossin f:: {}"],
  ["a simple While", "infiniteLoop :x<=5: {}"],
  ["boolean literals", "boolin x == based || unbased;;"],
  ["declare characters variables", "car a = r;;"],
  ["declare Strings variables", "manyCars a = Hello;;"],
  ["declare int variables", "int a = 3;;"],
  ["arithmetic", "dab 2 * x + 3 / 5 - -1 % 7 ** 3 ** 3;"],
  ["comment", "retweet:0:;; // this is a comment\n"],
  ["comments with no text", "retweet:1:;;//\nretweet:0:;;//"],
  ["indexing array literals", "retweet:[1,2,3][1]:;;"],
  ["conditional", "dab x?y,z?y,p;;"],
  ["parentheses", "retweet:83 * ::::::::-:13 / 21::::::::: + 1 - 0:;;"],
  ["shifts", "dab 3 << 5 >> 8 << 13 >> 21;;"],
  ["while with empty block", "infiniteLoop based {}"],
  ["while with one statement block", "infiniteLoop based { int x = 1;; }"],
  ["nonempty array literal", "retweet:[1, 2, 3]:;;"],
  ["all numeric literal forms", "retweet:8 * 89.123 * 1.3E5 * 1.3E+5 * 1.3E-5:;;"],
  ["relational operators", "retweet:1<2||1<=2||1==2||1!=2||1>=2||1>2:;;"],
  ["bitwise ops", "retweet :1|2|3: + :4^5^6: + :7&8&9:;;"],
  ["ands can be chained", "retweet:1 && 2 && 3 && 4 && 5:;;"],
  ["ors can be chained", "retweet:1 || 2 || 3 || 4 || 5:;;"],
  ["call in exp", "retweet:5 * f:x, y, 2 * y::;;"],
  ["call in statement", "int x = 1;;\nf:100:;;\nretweet:1:;;"],
  ["array type for param", "flossin f:x, [[[boolin]]]: {}"],
  ["array type returned", "flossin f::, [[int]] {}"],
  ["multiple statements", "retweet:1:;;\nx=5;; dab;; dab;;"]
]

// Programs with syntax errors that the parser will detect
const syntaxErrors = [ 
  ["non-letter in an identifier", "int ab😭c = 2;;", /Line 1, col 7:/],
  ["malformed number", "int x= 2.;;", /Line 1, col 10:/],
  ["a float with an E but no exponent", "int x = 5E * 11;;", /Line 1, col 10:/],
  ["a missing right operand", "retweet:5 -:;;", /Line 1, col 12:/],
  ["a non-operator", "retweet:7 * ::2 _ 3::;;", /Line 1, col 17:/],
  ["an expression starting with a :", "dab :;;", /Line 1, col 5:/],
  ["a statement starting with expression", "x * 5;;", /Line 1, col 3:/],
  ["an illegal statement on line 2", "retweet:5:;;\nx * 5;;", /Line 2, col 3:/],
  ["a statement starting with a :", "retweet:5:;;\n:", /Line 2, col 1:/],
  ["an expression starting with a *", "int x = * 71;;", /Line 1, col 9:/],
  ["negation before exponentiation", "retweet:-2**2:;;", /Line 1, col 12:/],
  ["mixing ands and ors", "retweet:1 && 2 || 3:;;", /Line 1, col 17:/],
  ["mixing ors and ands", "retweet:1 || 2 && 3:;;", /Line 1, col 17:/],
  ["associating relational operators", "retweet:1 < 2 < 3:;;", /Line 1, col 15:/],
  ["while without braces", "infiniteLoop based\nretweet:1:;;", /Line 2, col 1/],
  ["if without braces", "vibeCheck x < 3\nretweet:1:;;", /Line 2, col 1/],
  ["if as identifier", "int vibeCheck = 5;;", /Line 1, col 5/],
  ["unbalanced brackets", "flossin f::, int[;;", /Line 1, col 18/],
  ["empty array without type", "retweet:[]:;", /Line 1, col 11/],
  ["bad array literal", "retweet:[1,2,]:;;", /Line 1, col 14/],
  ["empty subscript", "retweet:a[]:;;", /Line 1, col 11/],
  ["true is not assignable", "based = 1;;", /Line 1, col 9/],
  ["false is not assignable", "unbased = 1;;", /Line 1, col 11/],
  ["no-paren function type", "flossin f(g,int->int) {}", /Line 1, col 19/],
  ["string lit with unknown escape", 'retweet:"ab\\zcdef":;;', /col 13/],
  ["string lit with code point too long", 'retweet:"\\u{1111111}":;;', /col 19/],
]

describe("The parser", () => {
  for (const [scenario, source] of syntaxChecks) {
    it(`recognizes ${scenario}`, () => {
      assert(ast(source))
    })
  }
  for (const [scenario, source, errorMessagePattern] of syntaxErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => ast(source), errorMessagePattern)
    })
  }
})
