defmodule JsParallelTest do
  use ExUnit.Case
  doctest JsParallel

  test "greets the world" do
    assert JsParallel.hello() == :world
  end
end
