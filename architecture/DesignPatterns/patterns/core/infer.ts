interface Box<T> {
  value: T;
}

type UnpackBox<A> = A extends Box<infer E> ? E : A;

type intStash = UnpackBox<{ value: 10 }>;
type stringStash = UnpackBox<{ value: "123" }>;
type booleanStash = UnpackBox<true>;
