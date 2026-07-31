import "./SearchBar.css";

interface SearchBarProps {
  valor: string;
  aoAlterar: (valor: string) => void;
}

function SearchBar({ valor, aoAlterar }: SearchBarProps) {
  return (
    <div className="search-bar">
      <label htmlFor="pesquisa" className="search-bar__label">
        Pesquisar postagens
      </label>

      <input
        id="pesquisa"
        type="search"
        value={valor}
        onChange={(event) => aoAlterar(event.target.value)}
        placeholder="Digite uma palavra-chave..."
        className="search-bar__input"
      />
    </div>
  );
}

export default SearchBar;