import * as t from 'io-ts'

export class OptionalType<RT extends t.Any, A = any, O = A, I = t.mixed> extends t.Type<A, O, I> {
  readonly _tag: 'OptionalType' = 'OptionalType'
  constructor(
    name: string,
    is: OptionalType<RT, A, O, I>['is'],
    validate: OptionalType<RT, A, O, I>['validate'],
    serialize: OptionalType<RT, A, O, I>['encode'],
    readonly type: RT
  ) {
    super(name, is, validate, serialize)
  }
}

export const optional = <RT extends t.Mixed>(
  type: RT,
  name: string = `(${type.name} | undefined)`
): OptionalType<RT, t.TypeOf<RT> | undefined, t.OutputOf<RT> | undefined, t.InputOf<RT> | undefined> => {
  return new OptionalType(
    name,
    (m): m is t.TypeOf<OptionalType<RT>> => type.is(m) || t.undefined.is(m),
    (m, c) => {
      const v = type.validate(m, c)
      return v.isLeft() && t.undefined.is(m) ? t.success(m) : v
    },
    type.encode !== t.identity ? a => (type.is(a) ? type.encode(a) : a) : t.identity,
    type
  )
}
