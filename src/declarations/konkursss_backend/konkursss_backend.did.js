export const idlFactory = ({ IDL }) => {
  const AccEntry = IDL.Record({
    'username' : IDL.Text,
    'password' : IDL.Text,
    'email' : IDL.Text,
  });
  const CryptoEntry = IDL.Record({
    'icon' : IDL.Text,
    'name' : IDL.Text,
    'shortcut' : IDL.Text,
  });
  return IDL.Service({
    'add_account' : IDL.Func([AccEntry], [], []),
    'add_crypto' : IDL.Func([CryptoEntry], [], []),
    'dodaj_wpis' : IDL.Func([IDL.Text], [], []),
    'edytuj_wpis' : IDL.Func([IDL.Nat64, IDL.Text], [], []),
    'get_all_accounts' : IDL.Func([], [IDL.Vec(AccEntry)], ['query']),
    'get_all_cryptos' : IDL.Func([], [IDL.Vec(CryptoEntry)], ['query']),
    'odczytaj_wpisy' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'usun_wpis' : IDL.Func([IDL.Nat64], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
