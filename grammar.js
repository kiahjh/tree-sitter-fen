/**
 * @file A simple SDL for generating typesafe and cross-language code.
 * @author Miciah Henderson <miciahjohnhenderson@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: `fen`,

  extras: ($) => [$.comment, $._whitespace],

  rules: {
    source_file: ($) =>
      seq(
        $.metadata,
        $.divider,
        $.route_io,
        optional(seq($.divider, $.helper_definitions)),
      ),

    // extras
    _whitespace: () => /\s+/,
    comment: () => token(seq(`//`, /.*/)),

    // metadata
    metadata: ($) =>
      seq(
        $.name_metadata_entry,
        optional($.description_metadata_entry),
        optional($.authed_metadata_entry),
      ),

    name_metadata_entry: ($) =>
      seq($.name_metadata_keyword, `:`, $.string_literal),
    name_metadata_keyword: () => token(`name`),

    description_metadata_entry: ($) =>
      seq($.description_metadata_keyword, `:`, $.string_literal),
    description_metadata_keyword: () => token(`description`),

    authed_metadata_entry: ($) =>
      seq($.authed_metadata_keyword, `:`, $.boolean_literal),
    authed_metadata_keyword: () => token(`authed`),

    // route i/o
    route_io: ($) => repeat1($.io_definition),

    io_definition: ($) =>
      seq(
        `@`,
        $.identifier,
        choice($.struct_definition_block, $.enum_definition_block),
      ),

    // helper definitions
    helper_definitions: ($) => seq($.helper_definition),

    helper_definition: ($) =>
      seq(
        $.identifier,
        choice($.struct_definition_block, $.enum_definition_block),
      ),

    // basic building blocks
    divider: () => `---`,

    string_literal: () => /"[^"]*"/,

    boolean_literal: () => choice(`true`, `false`),

    struct_definition_block: ($) => seq(`{`, repeat($.struct_field), `}`),

    struct_field: ($) => seq($.identifier, `:`, $._type),

    enum_definition_block: ($) => seq(`(`, repeat($.enum_variant), `)`),

    enum_variant: ($) => seq($.identifier, optional(seq(`(`, $._type, `)`))),

    identifier: () => /[a-zA-Z_][a-zA-Z0-9_]*/,

    _type: ($) =>
      choice(
        $.int_type,
        $.float_type,
        $.boolean_type,
        $.string_type,
        $.uuid_type,
        $.date_type,
        $.array_type,
        $.optional_type,
        $.identifier,
      ),

    int_type: () => `Int`,

    float_type: () => `Float`,

    string_type: () => `String`,

    boolean_type: () => `Boolean`,

    uuid_type: () => `UUID`,

    date_type: () => `Date`,

    array_type: ($) => seq(`[`, $._type, `]`),

    optional_type: ($) => seq($._type, `?`),
  },
});
