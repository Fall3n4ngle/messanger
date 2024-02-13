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
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mb-4">
        Test users
      </h4>
      <ul>
        {testUsers.map(({ password, userName }) => (
          <li
            key={password}
            className="flex items-center justify-between gap-3 flex-wrap text-sm mb-2"
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
