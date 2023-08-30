defmodule JsParallel do

  # Función de Elixir que convierte el archivo code.js en un resaltador léxico HTML+CSS
  def toHTML(fileName) do
    code = File.read!(fileName) |> to_charlist |> :lexer.string |> elem(1) |>
    Enum.map(fn {token,_,chars} -> (cond do
      token == :identifier ->
        "<span style='color:rgb(0, 70, 182);'>" <> to_string(chars) <> "</span>"
      token == :reservedWord ->
        "<span style='color:rgb(190, 1, 1);'>" <> to_string(chars) <> "</span>"
      token == :int || token == :bigInt || token == :intUnderS || token == :float || token == :exponential || token == :binary || token == :octal || token == :hexadecimal || token == :bool ->
        "<span style='color:rgb(212, 138, 0);'>" <> to_string(chars) <> "</span>"
      token == :operator || token == :logicOperator || token == :arrowOperator ->
        "<span style='color:rgb(209, 0, 209);'>" <> to_string(chars) <> "</span>"
      token == :string ->
        "<span style='color:green;'>" <> to_string(chars) <> "</span>"
      token == :comment1L || token == :commentML || token == :commentHash ->
        "<span style='color:grey;'>" <> to_string(chars) <> "</span>"
      true ->
        to_string(chars)
    end) end) |> Enum.join()

    html = "<!DOCTYPE html><html><head><title>Tarea</title></head><body><h1>Resaltador Léxico para Javascript</h1><h2>Hecho por Daniel Esteban Maldonado Espitia (A01657967)</h2><pre><h3>Nombre de archivo fuente: #{fileName}</h3>" <> code <> "</pre></body></html>"

    html
  end

  # Funciones que leen una cada una de las subcarpetas dentro de la carpeta "jsFiles" para convertir el código que tienen dentro a HTML
  def folder1 do
    for x <- Path.wildcard("jsTOhtml_para/js/*.html"), do: File.rm(x) # Eliminamos cualquier archivo que tenga la carpeta "jsTOhtml_para/js"
    Enum.map(Path.wildcard("jsFiles/js/*.js"), fn x -> (
      n = (Path.wildcard("jsTOhtml_para/js/*") |> Kernel.length) + 1
      File.write!("jsTOhtml_para/js/index#{n}.html", toHTML(x))
    ) end)
  end
  def folder2 do
    for x <- Path.wildcard("jsTOhtml_para/moreJS/*.html"), do: File.rm(x) # Eliminamos cualquier archivo que tenga la carpeta "jsTOhtml_para/moreJS"
    Enum.map(Path.wildcard("jsFiles/moreJS/*.js"), fn x -> (
      n = (Path.wildcard("jsTOhtml_para/moreJS/*") |> Kernel.length) + 1
      File.write!("jsTOhtml_para/moreJS/index#{n}.html", toHTML(x))
    ) end)
  end
  def folder3 do
    for x <- Path.wildcard("jsTOhtml_para/zzJS/*.html"), do: File.rm(x) # Eliminamos cualquier archivo que tenga la carpeta "jsTOhtml_para/zzJS"
    Enum.map(Path.wildcard("jsFiles/zzJS/*.js"), fn x -> (
      n = (Path.wildcard("jsTOhtml_para/zzJS/*") |> Kernel.length) + 1
      File.write!("jsTOhtml_para/zzJS/index#{n}.html", toHTML(x))
    ) end)
  end

  # Función que convierte todos los archivos de la carpeta "jsFiles" en código HTML de forma paralela y los almacena en la carpeta "jsTOhtml_para"
  def paralelo do
    t1 = fn -> folder1() end |> Task.async
    t2 = fn -> folder2() end |> Task.async
    t3 = fn -> folder3() end |> Task.async
    :lists.merge([Task.await(t1), Task.await(t2), Task.await(t3)])
  end

  # Función que convierte todos los archivos de la carpeta "jsFiles" en código HTML de forma iterativa y los almacena en la carpeta "jsTOhtml_iter"
  def iterative do
    for x <- Path.wildcard("jsTOhtml_iter/*.html"), do: File.rm(x) # Eliminamos cualquier archivo que tenga la carpeta "jsTOhtml_iter"
    Path.wildcard("jsFiles/**/*.js") |> Enum.map(fn x -> (
      n = (Path.wildcard("jsTOhtml_iter/*") |> Kernel.length) + 1
      File.write!("jsTOhtml_iter/index#{n}.html", toHTML(x))
    ) end)
  end

  # Función que mide los tiempos de varias ejecuciones de las dos versiones del programa
  # Para ejecutarlo en la línea de comandos iex, se debe escribir lo siguiente:
  # JsParallel.benchmark
  def benchmark do
    Benchee.run(%{
      "iterative" => fn -> JsParallel.iterative() end,
      "parallel" => fn -> JsParallel.paralelo() end
    })
  end
end
