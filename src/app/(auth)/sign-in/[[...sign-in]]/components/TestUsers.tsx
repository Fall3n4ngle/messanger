const testUsers = [
  {
    userName: "user1",
    password: "user1_password",
  },
  {
    userName: "user2",
    password: "user2_password",
  },
];

export default function TestUsers() {
  return (
    <>
      <h4 className="mb-4 scroll-m-20 text-xl font-semibold tracking-tight">
        Test users
      </h4>
      <ul>
        {testUsers.map(({ password, userName }) => (
          <li
            key={password}
            className="mb-2 flex flex-wrap items-center justify-between gap-3 text-sm"
          >
            <span>
              Username: <strong>{userName}</strong>
            </span>
            <span>
              Password: <strong>{password}</strong>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
